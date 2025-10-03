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
      tokenStart: AMOCRM_CONFIG.longToken?.substring(0, 20) + '...',
      tokenEnd: '...' + AMOCRM_CONFIG.longToken?.substring(-10),
      isConfigured: AMOCRM_CONFIG.subdomain !== 'your-subdomain' && AMOCRM_CONFIG.longToken !== 'your-long-token'
    }

    console.log('AmoCRM токен диагностика:', config)

    if (!config.isConfigured) {
      return NextResponse.json({
        status: 'not_configured',
        message: 'AmoCRM не настроен. Укажите AMOCRM_SUBDOMAIN и AMOCRM_LONG_TOKEN в .env.local',
        config
      })
    }

    // Проверяем формат токена
    const tokenFormat = {
      isJWT: AMOCRM_CONFIG.longToken?.includes('.'),
      hasBearer: AMOCRM_CONFIG.longToken?.startsWith('Bearer '),
      length: AMOCRM_CONFIG.longToken?.length,
      isValidLength: (AMOCRM_CONFIG.longToken?.length || 0) > 100
    }

    return NextResponse.json({
      status: 'configured',
      message: 'AmoCRM токен настроен',
      config,
      tokenFormat,
      recommendations: [
        tokenFormat.isJWT ? '✅ Токен выглядит как JWT' : '⚠️ Токен не похож на JWT',
        tokenFormat.hasBearer ? '⚠️ Токен содержит "Bearer " - уберите его' : '✅ Токен без "Bearer "',
        tokenFormat.isValidLength ? '✅ Длина токена нормальная' : '⚠️ Токен слишком короткий'
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
