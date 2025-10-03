import { NextRequest, NextResponse } from 'next/server'
import { amocrmConfig } from '@/lib/amocrm'

export async function GET() {
  try {
    // Проверяем конфигурацию AmoCRM
    const config = {
      subdomain: amocrmConfig.subdomain,
      clientId: amocrmConfig.clientId,
      redirectUri: amocrmConfig.redirectUri,
      hasClientSecret: !!amocrmConfig.clientSecret,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL
    }

    // Генерируем тестовый URL авторизации
    const testState = 'debug-test-state'
    const authUrl = `https://${amocrmConfig.subdomain}.amocrm.ru/oauth2/authorize?` + 
      new URLSearchParams({
        client_id: amocrmConfig.clientId,
        redirect_uri: amocrmConfig.redirectUri,
        response_type: 'code',
        scope: 'crm',
        state: testState
      }).toString()

    // Проверяем доступность AmoCRM API
    let amocrmStatus = 'unknown'
    try {
      const response = await fetch(`https://${amocrmConfig.subdomain}.amocrm.ru/api/v4/account`, {
        method: 'GET',
        headers: {
          'User-Agent': 'FitZone-Landing/1.0'
        }
      })
      amocrmStatus = response.status === 401 ? 'accessible' : `status_${response.status}`
    } catch {
      amocrmStatus = 'error'
    }

    return NextResponse.json({
      success: true,
      debug_info: {
        config,
        auth_url: authUrl,
        amocrm_status: amocrmStatus,
        timestamp: new Date().toISOString(),
        suggestions: [
          'Убедитесь, что интеграция создана в AmoCRM',
          'Проверьте правильность Redirect URI в настройках интеграции',
          'Убедитесь, что интеграция имеет права доступа к CRM',
          'Проверьте, что Client ID и Client Secret правильные'
        ]
      }
    })

  } catch (error) {
    console.error('Ошибка диагностики AmoCRM:', error)
    return NextResponse.json({
      success: false,
      error: 'Debug failed',
      message: 'Ошибка диагностики AmoCRM',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
