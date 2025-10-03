import { NextResponse } from 'next/server'

// AmoCRM конфигурация
const AMOCRM_CONFIG = {
  subdomain: process.env.AMOCRM_SUBDOMAIN || 'your-subdomain',
  longToken: process.env.AMOCRM_LONG_TOKEN || 'your-long-token'
}

export async function GET() {
  try {
    // Проверяем конфигурацию
    if (!AMOCRM_CONFIG.subdomain || AMOCRM_CONFIG.subdomain === 'your-subdomain') {
      return NextResponse.json({
        status: 'error',
        message: 'AMOCRM_SUBDOMAIN не настроен'
      })
    }

    if (!AMOCRM_CONFIG.longToken || AMOCRM_CONFIG.longToken === 'your-long-token') {
      return NextResponse.json({
        status: 'error',
        message: 'AMOCRM_LONG_TOKEN не настроен'
      })
    }

    // Строим URL для получения полей лидов
    let baseUrl
    if (AMOCRM_CONFIG.subdomain.includes('.amocrm.ru')) {
      baseUrl = `https://${AMOCRM_CONFIG.subdomain}/api/v4/leads/custom_fields`
    } else {
      baseUrl = `https://${AMOCRM_CONFIG.subdomain}.amocrm.ru/api/v4/leads/custom_fields`
    }

    console.log('Получение полей AmoCRM:', {
      subdomain: AMOCRM_CONFIG.subdomain,
      url: baseUrl
    })

    // Получаем список полей
    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AMOCRM_CONFIG.longToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({
        status: 'error',
        message: 'Ошибка получения полей AmoCRM',
        details: {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: baseUrl
        }
      })
    }

    const fieldsData = await response.json()
    const fields = fieldsData._embedded?.custom_fields || []
    
    // Ищем поля для телефона
    const phoneFields = fields.filter((f: Record<string, unknown>) => 
      f.type === 'PHONE' || 
      (f.name as string)?.toLowerCase().includes('телефон') ||
      (f.name as string)?.toLowerCase().includes('phone')
    )

    // Ищем поля для направления
    const directionFields = fields.filter((f: Record<string, unknown>) => 
      f.type === 'TEXT' && (
        (f.name as string)?.toLowerCase().includes('направление') ||
        (f.name as string)?.toLowerCase().includes('direction') ||
        (f.name as string)?.toLowerCase().includes('тренировка')
      )
    )

    // Ищем поля для источника
    const sourceFields = fields.filter((f: Record<string, unknown>) => 
      f.type === 'TEXT' && (
        (f.name as string)?.toLowerCase().includes('источник') ||
        (f.name as string)?.toLowerCase().includes('source')
      )
    )

    return NextResponse.json({
      status: 'success',
      message: 'Поля AmoCRM получены успешно',
      totalFields: fields.length,
      phoneFields: phoneFields.map((f: Record<string, unknown>) => ({
        id: f.id,
        name: f.name,
        type: f.type,
        code: f.code
      })),
      directionFields: directionFields.map((f: Record<string, unknown>) => ({
        id: f.id,
        name: f.name,
        type: f.type,
        code: f.code
      })),
      sourceFields: sourceFields.map((f: Record<string, unknown>) => ({
        id: f.id,
        name: f.name,
        type: f.type,
        code: f.code
      })),
      allFields: fields.map((field: Record<string, unknown>) => ({
        id: field.id,
        name: field.name,
        type: field.type,
        code: field.code,
        isRequired: field.is_required
      }))
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Внутренняя ошибка',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
