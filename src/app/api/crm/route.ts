import { NextRequest, NextResponse } from 'next/server'

interface FormData {
  name: string
  phone: string
  direction: string
  message?: string
}

// Webhook конфигурация
const WEBHOOK_CONFIG = {
  url: process.env.WEBHOOK_URL || 'https://your-webhook-endpoint.com/leads',
  secret: process.env.WEBHOOK_SECRET || 'your-webhook-secret'
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
      body: JSON.stringify(leadData)
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

    // Отправка лида через webhook
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
      webhookSuccess
    })

    return NextResponse.json({
      success: true,
      message: 'Заявка успешно отправлена',
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