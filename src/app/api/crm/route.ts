import { NextRequest, NextResponse } from 'next/server'

interface FormData {
  name: string
  phone: string
  direction: string
  message?: string
}

interface AmoCRMContact {
  name: string
  custom_fields_values?: Array<{
    field_id: number
    values: Array<{ value: string }>
  }>
}

interface AmoCRMLead {
  name: string
  price: number
  custom_fields_values?: Array<{
    field_id: number
    values: Array<{ value: string }>
  }>
  _embedded?: {
    contacts?: AmoCRMContact[]
  }
}

// Конфигурация amoCRM (в реальном проекте должна быть в переменных окружения)
const AMOCRM_CONFIG = {
  subdomain: process.env.AMOCRM_SUBDOMAIN || 'your-subdomain',
  clientId: process.env.AMOCRM_CLIENT_ID || 'your-client-id',
  clientSecret: process.env.AMOCRM_CLIENT_SECRET || 'your-client-secret',
  redirectUri: process.env.AMOCRM_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/amocrm/callback`,
  accessToken: process.env.AMOCRM_ACCESS_TOKEN || 'your-access-token'
}

// ID полей в amoCRM (настраиваются в админке amoCRM)
const FIELD_IDS = {
  phone: 264911, // ID поля "Телефон"
  direction: 264913, // ID поля "Направление тренировки"
  source: 264915 // ID поля "Источник"
}

interface AmoCRMResponse {
  _embedded?: {
    leads?: Array<{ id: number }>
    contacts?: Array<{ id: number }>
  }
}

async function createAmoCRMLead(formData: FormData): Promise<AmoCRMResponse> {
  const { name, phone, direction, message } = formData

  // Создание контакта
  const contact: AmoCRMContact = {
    name,
    custom_fields_values: [
      {
        field_id: FIELD_IDS.phone,
        values: [{ value: phone }]
      }
    ]
  }

  // Создание сделки
  const lead: AmoCRMLead = {
    name: `Заявка с сайта: ${direction}`,
    price: 0,
    custom_fields_values: [
      {
        field_id: FIELD_IDS.direction,
        values: [{ value: direction }]
      },
      {
        field_id: FIELD_IDS.source,
        values: [{ value: 'Лендинг FitZone' }]
      }
    ],
    _embedded: {
      contacts: [contact]
    }
  }

  // Добавляем сообщение в примечания, если есть
  if (message) {
    // В реальной интеграции здесь будет создание примечания к сделке
  }

  try {
    const response = await fetch(`https://${AMOCRM_CONFIG.subdomain}.amocrm.ru/api/v4/leads/complex`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AMOCRM_CONFIG.accessToken}`
      },
      body: JSON.stringify([lead])
    })

    if (!response.ok) {
      throw new Error(`amoCRM API error: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Ошибка создания сделки в amoCRM:', error)
    throw error
  }
}

async function sendTelegramNotification(formData: FormData): Promise<void> {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChatId = process.env.TELEGRAM_CHAT_ID

  if (!telegramBotToken || !telegramChatId) {
    console.log('Telegram уведомления не настроены')
    return
  }

  const message = `
🔥 Новая заявка с сайта FitZone!

👤 Имя: ${formData.name}
📞 Телефон: ${formData.phone}
🏋️ Направление: ${formData.direction}
${formData.message ? `💬 Сообщение: ${formData.message}` : ''}

⏰ Время: ${new Date().toLocaleString('ru-RU')}
  `.trim()

  try {
    await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'HTML'
      })
    })
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

    // Создание сделки в amoCRM
    let crmResult = null
    try {
      crmResult = await createAmoCRMLead(formData)
    } catch (error) {
      console.error('Ошибка интеграции с amoCRM:', error)
      // Не прерываем выполнение, если CRM недоступна
    }

    // Отправка уведомления в Telegram
    try {
      await sendTelegramNotification(formData)
    } catch (error) {
      console.error('Ошибка отправки Telegram уведомления:', error)
      // Не прерываем выполнение
    }

    // Логирование для аналитики
    console.log('Новая заявка:', {
      name: formData.name,
      direction: formData.direction,
      timestamp: new Date().toISOString(),
      crmSuccess: !!crmResult
    })

    return NextResponse.json({
      success: true,
      message: 'Заявка успешно отправлена',
      leadId: crmResult?._embedded?.leads?.[0]?.id || null
    })

  } catch (error) {
    console.error('Ошибка обработки заявки:', error)
    
    return NextResponse.json(
      { 
        error: 'Внутренняя ошибка сервера',
        message: 'Попробуйте отправить заявку позже или свяжитесь с нами по телефону'
      },
      { status: 500 }
    )
  }
}

// Опциональный GET метод для проверки работоспособности API
export async function GET() {
  return NextResponse.json({
    status: 'API работает',
    timestamp: new Date().toISOString(),
    endpoints: {
      POST: '/api/crm - отправка заявки'
    }
  })
}

