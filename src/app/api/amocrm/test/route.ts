import { NextResponse } from 'next/server'

// AmoCRM конфигурация
const AMOCRM_CONFIG = {
  subdomain: process.env.AMOCRM_SUBDOMAIN || 'your-subdomain',
  longToken: process.env.AMOCRM_LONG_TOKEN || 'your-long-token'
}

export async function GET() {
  try {
    // Проверяем конфигурацию
    const config = {
      subdomain: AMOCRM_CONFIG.subdomain,
      hasToken: !!AMOCRM_CONFIG.longToken,
      tokenLength: AMOCRM_CONFIG.longToken?.length || 0,
      isConfigured: AMOCRM_CONFIG.subdomain !== 'your-subdomain' && AMOCRM_CONFIG.longToken !== 'your-long-token'
    }

    console.log('AmoCRM конфигурация:', config)

    if (!config.isConfigured) {
      return NextResponse.json({
        status: 'not_configured',
        message: 'AmoCRM не настроен. Укажите AMOCRM_SUBDOMAIN и AMOCRM_LONG_TOKEN в .env.local',
        config
      })
    }

    // Тестируем подключение к AmoCRM
    try {
      const response = await fetch(`https://${AMOCRM_CONFIG.subdomain}.amocrm.ru/api/v4/account`, {
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
          error: {
            status: response.status,
            statusText: response.statusText,
            error: errorText
          },
          config
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
        config
      })

    } catch (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Ошибка подключения к AmoCRM',
        error: error instanceof Error ? error.message : 'Unknown error',
        config
      })
    }

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Внутренняя ошибка',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
