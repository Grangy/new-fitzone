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

// Webhook удален - используем только AmoCRM + Telegram

// Функция для создания контакта в AmoCRM
async function createAmoCRMContact(formData: FormData): Promise<{ success: boolean; contactId?: number; error?: string }> {
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
    
    console.log('Создание контакта в AmoCRM:', {
      subdomain: AMOCRM_CONFIG.subdomain,
      hasToken: !!AMOCRM_CONFIG.longToken,
      contactData: { name, phone, direction, message }
    })
    
    // Создаем контакт с телефоном
    const contactData = {
      name: name,
      custom_fields_values: [
        {
          field_code: 'PHONE',
          values: [{ value: phone }]
        }
      ]
    }

    console.log('Данные контакта:', {
      name: contactData.name,
      phone: phone
    })

    // Строим URL для контактов
    let baseUrl
    if (AMOCRM_CONFIG.subdomain.includes('.amocrm.ru')) {
      baseUrl = `https://${AMOCRM_CONFIG.subdomain}/api/v4/contacts`
    } else {
      baseUrl = `https://${AMOCRM_CONFIG.subdomain}.amocrm.ru/api/v4/contacts`
    }
    
    console.log('AmoCRM Contacts URL:', baseUrl)
    
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AMOCRM_CONFIG.longToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([contactData])
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Ошибка AmoCRM Contacts API:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: baseUrl
      })
      return { 
        success: false, 
        error: `AmoCRM Contacts API error: ${response.status} - ${errorText}` 
      }
    }

    const result = await response.json()
    const contact = result?._embedded?.contacts?.[0]
    
    console.log('Контакт успешно создан в AmoCRM:', {
      id: contact?.id,
      name: contact?.name
    })

    return { 
      success: true, 
      contactId: contact?.id 
    }

  } catch (error) {
    console.error('Ошибка создания контакта в AmoCRM:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Функция для создания лида в AmoCRM
async function createAmoCRMLead(formData: FormData, contactId?: number): Promise<{ success: boolean; leadId?: number; error?: string }> {
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
    
    // Создаем лид с привязкой к контакту
    const leadData = {
      name: `Заявка от ${name} - ${direction}`,
      price: 0,
      contacts: contactId ? [{ id: contactId }] : [
        {
          phone: phone
        }
      ]
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
    
    // Строим правильный URL для лида
    let leadUrl = null
    if (lead?.id) {
      if (AMOCRM_CONFIG.subdomain.includes('.amocrm.ru')) {
        leadUrl = `https://${AMOCRM_CONFIG.subdomain}/leads/detail/${lead.id}`
      } else {
        leadUrl = `https://${AMOCRM_CONFIG.subdomain}.amocrm.ru/leads/detail/${lead.id}`
      }
    }

    console.log('Лид успешно создан в AmoCRM:', {
      id: lead?.id,
      name: lead?.name,
      url: leadUrl
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

// Webhook функции удалены

// Webhook функции удалены

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

    // Создание контакта в AmoCRM
    let contactResult = null
    try {
      contactResult = await createAmoCRMContact(formData)
    } catch (error) {
      console.error('Ошибка создания контакта в AmoCRM:', error)
      // Не прерываем выполнение, если AmoCRM недоступен
    }

    // Создание лида в AmoCRM с привязкой к контакту
    let amocrmResult = null
    try {
      amocrmResult = await createAmoCRMLead(formData, contactResult?.contactId)
    } catch (error) {
      console.error('Ошибка создания лида в AmoCRM:', error)
      // Не прерываем выполнение, если AmoCRM недоступен
    }

    // Логирование заявки
    console.log('Новая заявка:', {
      name: formData.name,
      direction: formData.direction,
      timestamp: new Date().toISOString(),
      contactSuccess: contactResult?.success || false,
      contactId: contactResult?.contactId,
      amocrmSuccess: amocrmResult?.success || false,
      amocrmLeadId: amocrmResult?.leadId
    })

    return NextResponse.json({
      success: true,
      message: 'Заявка успешно отправлена',
      contactSuccess: contactResult?.success || false,
      contactId: contactResult?.contactId,
      amocrmSuccess: amocrmResult?.success || false,
      amocrmLeadId: amocrmResult?.leadId
    })

  } catch (error) {
    console.error('Ошибка обработки заявки:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}