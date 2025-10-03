import { NextRequest, NextResponse } from 'next/server'

/**
 * Данные формы, которые приходят с фронта.
 * Поля formPage / referer необязательны, но если вы их передадите — мы возьмём их приоритетно.
 */
interface FormData {
  name: string
  phone: string
  workPhone?: string
  direction: string
  message?: string
  formPage?: string
  referer?: string
}

const AMOCRM_CONFIG = {
  subdomain: process.env.AMOCRM_SUBDOMAIN || 'your-subdomain',
  longToken: process.env.AMOCRM_LONG_TOKEN || 'your-long-token',
  pipelineId: process.env.AMOCRM_PIPELINE_ID ? Number(process.env.AMOCRM_PIPELINE_ID) : undefined,
  siteUrl: process.env.SITE_URL || '' // на случай, если в заголовках нет referer
}

// ====== Telegram уведомление (как у вас было) ======
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
${formData.workPhone ? `📱 *Рабочий телефон:* ${formData.workPhone}` : ''}
🏃 *Направление:* ${formData.direction}
${formData.message ? `💬 *Сообщение:* ${formData.message}` : ''}

⏰ *Время:* ${new Date().toLocaleString('ru-RU')}
🌐 *Источник:* FitZone Landing`

    const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

// ====== Отправка в «Неразобранное» (тип: форма) строго по документации ======
async function createUnsortedFormLead(
  request: NextRequest,
  formData: FormData
): Promise<{ success: boolean; uid?: string; leadId?: number; contactId?: number; error?: string }> {
  try {
    if (!AMOCRM_CONFIG.subdomain || !AMOCRM_CONFIG.longToken) {
      return { success: false, error: 'AmoCRM не настроен' }
    }

    const { name, phone } = formData
    const nowSec = Math.floor(Date.now() / 1000)

    // Согласно доке, metadata.form_page и metadata.referer не должны быть пустыми (NotBlank).
    // Источники:
    // - из тела (formData.formPage / formData.referer),
    // - из заголовка Referer,
    // - из SITE_URL,
    // - запасной дефолт (не пустая строка).
    const headerReferer = request.headers.get('referer') || request.headers.get('origin') || ''
    const form_page =
      (formData.formPage && formData.formPage.trim()) ||
      (headerReferer && headerReferer.trim()) ||
      (AMOCRM_CONFIG.siteUrl && AMOCRM_CONFIG.siteUrl.trim()) ||
      'https://example.com' // не пустая заглушка, чтобы пройти NotBlank
    const referer =
      (formData.referer && formData.referer.trim()) ||
      (headerReferer && headerReferer.trim()) ||
      (AMOCRM_CONFIG.siteUrl && AMOCRM_CONFIG.siteUrl.trim()) ||
      'https://example.com' // не пустая заглушка, чтобы пройти NotBlank

    // Требуемые поля верхнего уровня: source_uid, source_name, metadata (+ created_at/pipeline_id по желанию)
    // Вложенные сущности строго под _embedded: leads[], contacts[] (каждый массив с одним объектом)
    // Телефон — системное поле через field_code: "PHONE".
    const payload = [
      {
        source_uid: 'fitzone_form',         // ваш постоянный UID источника (любой уникальный)
        source_name: 'FitZone Landing',     // человекочитаемое имя источника
        request_id: `req_${nowSec}`,        // вернётся как есть (не обязателен)
        created_at: nowSec,                 // unix timestamp (не обязателен, но полезен)
        ...(AMOCRM_CONFIG.pipelineId ? { pipeline_id: AMOCRM_CONFIG.pipelineId } : {}),
        metadata: {
          form_id: 'fitzone_form',          // ID формы на вашей стороне
          form_name: 'Форма заявки',        // имя формы
          form_page,                        // <-- НЕ пустое (NotBlank)
          form_sent_at: nowSec,             // unix timestamp отправки формы
          referer                           // <-- НЕ пустое (NotBlank)
        },
        _embedded: {
          leads: [
            {
              name: `Заявка от ${name}`
            }
          ],
          contacts: [
            {
              name,
              custom_fields_values: [
                {
                  field_code: 'PHONE',
                  values: [{ value: phone }]
                }
              ]
            }
          ]
        }
      }
    ]

    // Правильный URL из сабдомена
    const baseUrl = AMOCRM_CONFIG.subdomain.includes('.amocrm.ru')
      ? `https://${AMOCRM_CONFIG.subdomain}/api/v4/leads/unsorted/forms`
      : `https://${AMOCRM_CONFIG.subdomain}.amocrm.ru/api/v4/leads/unsorted/forms`

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AMOCRM_CONFIG.longToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Ошибка unsorted/forms API:', errText)
      return { success: false, error: `Unsorted API error: ${response.status} - ${errText}` }
    }

    // Ответ по доке: вернётся объект(ы) unsorted с ссылками на вложенные сущности
    // На этот момент сделка и контакт ещё "в неразобранном"; прямых id лида/контакта может не быть до принятия.
    const result = await response.json()

    // Из примеров в доке: в ответе отдаётся сущность с _embedded.leads/contacts и ссылками (id может присутствовать)
    const first = Array.isArray(result)? result[0] : (result?._embedded?.unsorted?.[0] || result)
    const uid = first?.uid || first?.id // uid неразобранного (если вернули)
    const embedded = first?._embedded || result?._embedded
    const lead = embedded?.leads?.[0]
    const contact = embedded?.contacts?.[0]

    return {
      success: true,
      uid,
      leadId: lead?.id,
      contactId: contact?.id
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// ====== Основной обработчик ======
export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json()

    // Базовая валидация
    if (!formData.name || !formData.phone || !formData.direction) {
      return NextResponse.json({ error: 'Не все обязательные поля заполнены' }, { status: 400 })
    }

    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
    if (!phoneRegex.test(formData.phone)) {
      return NextResponse.json({ error: 'Некорректный формат телефона' }, { status: 400 })
    }

    // Уведомим в Telegram (не влияет на CRM)
    await sendTelegramNotification(formData)

    // Строго по доке «Неразобранное → формы»
    const unsorted = await createUnsortedFormLead(request, formData)

    console.log('Новая заявка (unsorted):', {
      name: formData.name,
      direction: formData.direction,
      timestamp: new Date().toISOString(),
      uid: unsorted.uid,
      amocrmSuccess: unsorted.success,
      leadId: unsorted.leadId,
      contactId: unsorted.contactId,
      error: unsorted.error
    })

    return NextResponse.json({
      success: unsorted.success,
      message: unsorted.success ? 'Заявка отправлена в «Неразобранное»' : 'Ошибка при отправке в AmoCRM',
      uid: unsorted.uid,
      leadId: unsorted.leadId,
      contactId: unsorted.contactId,
      error: unsorted.error
    })
  } catch (error) {
    console.error('Ошибка обработки заявки:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}
