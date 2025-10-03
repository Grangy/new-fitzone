import { NextRequest, NextResponse } from 'next/server'

interface FormData {
  name: string
  phone: string
  direction: string
  message?: string
}

// AmoCRM конфигурация
const AMOCRM_CONFIG = {
  subdomain: process.env.AMOCRM_SUBDOMAIN || 'your-subdomain',
  longToken: process.env.AMOCRM_LONG_TOKEN || 'your-long-token'
}

// Webhook конфигурация
const WEBHOOK_CONFIG = {
  url: process.env.WEBHOOK_URL || 'https://your-webhook-endpoint.com/leads',
  secret: process.env.WEBHOOK_SECRET || 'your-webhook-secret'
}

// Функция для создания лида в AmoCRM
async function createAmoCRMLead(formData: FormData): Promise<{ success: boolean; leadId?: number; error?: string }> {
  try {
    // Проверяем конфигурацию AmoCRM
    if (!AMOCRM_CONFIG.subdomain || AMOCRM_CONFIG.subdomain === 'your-subdomain') {
      console.warn('AmoCRM не настроен: AMOCRM_SUBDOMAIN не указан')
      return { 
        success: false, 
        error: 'AmoCRM не настроен: укажите AMOCRM_SUBDOMAIN' 
      }
    }

    if (!AMOCRM_CONFIG.longToken || AMOCRM_CONFIG.longToken === 'your-long-token') {
      console.warn('AmoCRM не настроен: AMOCRM_LONG_TOKEN не указан')
      return { 
        success: false, 
        error: 'AmoCRM не настроен: укажите AMOCRM_LONG_TOKEN' 
      }
    }

  const { name, phone, direction, message } = formData

    console.log('Создание лида в AmoCRM:', {
      subdomain: AMOCRM_CONFIG.subdomain,
      hasToken: !!AMOCRM_CONFIG.longToken,
      tokenLength: AMOCRM_CONFIG.longToken?.length || 0,
      tokenStart: AMOCRM_CONFIG.longToken?.substring(0, 20) + '...',
      leadData: { name, phone, direction, message }
    })
    
    // Создаем простой лид без кастомных полей для начала
    const leadData = {
      name: `Заявка от ${name} - ${direction}`,
      price: 0
    }

    console.log('Данные лида:', {
      name: leadData.name,
      phone: phone,
      direction: direction,
      message: message
    })

    // Проверяем, содержит ли subdomain уже полный домен
    let baseUrl
    if (AMOCRM_CONFIG.subdomain.includes('.amocrm.ru')) {
      // Если уже полный домен, используем как есть
      baseUrl = `https://${AMOCRM_CONFIG.subdomain}/api/v4/leads`
      console.log('Используем полный домен:', AMOCRM_CONFIG.subdomain)
    } else {
      // Если только subdomain, добавляем .amocrm.ru
      baseUrl = `https://${AMOCRM_CONFIG.subdomain}.amocrm.ru/api/v4/leads`
      console.log('Добавляем .amocrm.ru к subdomain:', AMOCRM_CONFIG.subdomain)
    }
    
    console.log('AmoCRM URL:', baseUrl)
    console.log('Проверка URL:', {
      originalSubdomain: AMOCRM_CONFIG.subdomain,
      containsAmocrm: AMOCRM_CONFIG.subdomain.includes('.amocrm.ru'),
      finalUrl: baseUrl
    })
    
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AMOCRM_CONFIG.longToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([leadData])
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Ошибка AmoCRM API:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: baseUrl
      })
      return { 
        success: false, 
        error: `AmoCRM API error: ${response.status} - ${errorText}` 
      }
    }

    const result = await response.json()
    const lead = result?._embedded?.leads?.[0]
    
    console.log('Лид успешно создан в AmoCRM:', {
      id: lead?.id,
      name: lead?.name,
      url: lead?.id ? `https://${AMOCRM_CONFIG.subdomain}.amocrm.ru/leads/detail/${lead.id}` : null
    })

    return { 
      success: true, 
      leadId: lead?.id 
    }

  } catch (error) {
    console.error('Ошибка создания лида в AmoCRM:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Функция для отправки лида через webhook
async function sendLeadToWebhook(formData: FormData): Promise<boolean> {
  try {
    const leadData = {
      name: formData.name,
      phone: formData.phone,
      direction: formData.direction,
      message: formData.message || '',
      timestamp: new Date().toISOString(),
      source: 'FitZone Landing',
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    }

    // Создаем подпись для безопасности
    const signature = await createWebhookSignature(leadData, WEBHOOK_CONFIG.secret)

    const response = await fetch(WEBHOOK_CONFIG.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Source': 'FitZone-Landing'
      },
      body: JSON.stringify(leadData),
      // Добавляем опции для обработки SSL ошибок
      signal: AbortSignal.timeout(10000) // 10 секунд таймаут
    })

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`)
    }

    console.log('Лид успешно отправлен через webhook:', leadData.id)
    return true

  } catch (error) {
    console.error('Ошибка отправки лида через webhook:', error)
    return false
  }
}

// Функция для создания подписи webhook
async function createWebhookSignature(data: Record<string, unknown>, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(JSON.stringify(data))
  )
  
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Функция для отправки уведомления в Telegram
async function sendTelegramNotification(formData: FormData) {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChatId = process.env.TELEGRAM_CHAT_ID

  if (!telegramBotToken || !telegramChatId) {
    console.log('Telegram не настроен, пропускаем уведомление')
    return
  }

  try {
    const message = `🎯 *Новая заявка с сайта FitZone*

👤 *Имя:* ${formData.name}
📞 *Телефон:* ${formData.phone}
🏃 *Направление:* ${formData.direction}
${formData.message ? `💬 *Сообщение:* ${formData.message}` : ''}

⏰ *Время:* ${new Date().toLocaleString('ru-RU')}
🌐 *Источник:* FitZone Landing`

    const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'Markdown'
      })
    })

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`)
    }

    console.log('Уведомление в Telegram отправлено')
  } catch (error) {
    console.error('Ошибка отправки Telegram уведомления:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json()

    // Валидация данных
    if (!formData.name || !formData.phone || !formData.direction) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 }
      )
    }

    // Валидация телефона (простая проверка)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
    if (!phoneRegex.test(formData.phone)) {
      return NextResponse.json(
        { error: 'Некорректный формат телефона' },
        { status: 400 }
      )
    }

    // Отправка уведомления в Telegram
    await sendTelegramNotification(formData)

    // Создание лида в AmoCRM
    let amocrmResult = null
    try {
      amocrmResult = await createAmoCRMLead(formData)
    } catch (error) {
      console.error('Ошибка создания лида в AmoCRM:', error)
      // Не прерываем выполнение, если AmoCRM недоступен
    }

    // Отправка лида через webhook (опционально)
    let webhookSuccess = false
    try {
      webhookSuccess = await sendLeadToWebhook(formData)
    } catch (error) {
      console.error('Ошибка отправки webhook:', error)
      // Не прерываем выполнение, если webhook недоступен
    }

    // Логирование заявки
    console.log('Новая заявка:', {
      name: formData.name,
      direction: formData.direction,
      timestamp: new Date().toISOString(),
      amocrmSuccess: amocrmResult?.success || false,
      amocrmLeadId: amocrmResult?.leadId,
      webhookSuccess
    })

    return NextResponse.json({
      success: true,
      message: 'Заявка успешно отправлена',
      amocrmSuccess: amocrmResult?.success || false,
      amocrmLeadId: amocrmResult?.leadId,
      webhookSuccess
    })

  } catch (error) {
    console.error('Ошибка обработки заявки:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}