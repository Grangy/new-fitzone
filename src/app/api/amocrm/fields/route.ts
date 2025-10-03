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

    // Строим URL
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
    
    // Фильтруем поля по типам
    const fields = fieldsData._embedded?.custom_fields || []
    
    const fieldTypes = {
      phone: fields.filter(f => f.type === 'PHONE'),
      text: fields.filter(f => f.type === 'TEXT'),
      textarea: fields.filter(f => f.type === 'TEXTAREA'),
      select: fields.filter(f => f.type === 'SELECT'),
      multiselect: fields.filter(f => f.type === 'MULTISELECT')
    }

    return NextResponse.json({
      status: 'success',
      message: 'Поля AmoCRM получены успешно',
      totalFields: fields.length,
      fieldTypes,
      allFields: fields.map(field => ({
        id: field.id,
        name: field.name,
        type: field.type,
        code: field.code,
        isRequired: field.is_required,
        isSystem: field.is_system
      })),
      recommendations: [
        'Используйте поля с type: PHONE для телефона',
        'Используйте поля с type: TEXT для направления',
        'Используйте поля с type: TEXTAREA для комментариев',
        'Проверьте is_required для обязательных полей'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Внутренняя ошибка',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
