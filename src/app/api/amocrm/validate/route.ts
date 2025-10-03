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
      baseUrl = `https://${AMOCRM_CONFIG.subdomain}/api/v4/account`
    } else {
      baseUrl = `https://${AMOCRM_CONFIG.subdomain}.amocrm.ru/api/v4/account`
    }

    console.log('Валидация AmoCRM:', {
      subdomain: AMOCRM_CONFIG.subdomain,
      tokenLength: AMOCRM_CONFIG.longToken.length,
      tokenStart: AMOCRM_CONFIG.longToken.substring(0, 20) + '...',
      url: baseUrl
    })

    // Тестируем подключение
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
        message: 'Ошибка подключения к AmoCRM',
        details: {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: baseUrl
        }
      })
    }

    const accountData = await response.json()
    
    return NextResponse.json({
      status: 'success',
      message: 'AmoCRM подключен успешно',
      account: {
        id: accountData.id,
        name: accountData.name,
        subdomain: accountData.subdomain
      },
      config: {
        subdomain: AMOCRM_CONFIG.subdomain,
        tokenLength: AMOCRM_CONFIG.longToken.length,
        url: baseUrl
      }
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Внутренняя ошибка',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
