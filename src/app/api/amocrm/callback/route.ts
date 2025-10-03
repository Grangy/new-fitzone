import { NextRequest, NextResponse } from 'next/server'

// Конфигурация amoCRM
const AMOCRM_CONFIG = {
  subdomain: process.env.AMOCRM_SUBDOMAIN || 'your-subdomain',
  clientId: process.env.AMOCRM_CLIENT_ID || 'your-client-id',
  clientSecret: process.env.AMOCRM_CLIENT_SECRET || 'your-client-secret',
  redirectUri: process.env.AMOCRM_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/amocrm/callback`
}

interface AmoCRMTokenResponse {
  token_type: string
  expires_in: number
  access_token: string
  refresh_token: string
}

interface AmoCRMErrorResponse {
  error: string
  error_description: string
}

// Функция для обновления токена доступа
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch(`https://${AMOCRM_CONFIG.subdomain}.amocrm.ru/oauth2/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: AMOCRM_CONFIG.clientId,
        client_secret: AMOCRM_CONFIG.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        redirect_uri: AMOCRM_CONFIG.redirectUri,
      }),
    })

    if (!response.ok) {
      console.error('Ошибка обновления токена:', await response.text())
      return null
    }

    const data: AmoCRMTokenResponse = await response.json()
    
    // В реальном приложении здесь нужно сохранить токены в базе данных
    console.log('Токен обновлен:', {
      access_token: data.access_token.substring(0, 10) + '...',
      expires_in: data.expires_in
    })

    return data.access_token
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error)
    return null
  }
}

// Функция для получения информации об аккаунте
async function getAccountInfo(accessToken: string) {
  try {
    const response = await fetch(`https://${AMOCRM_CONFIG.subdomain}.amocrm.ru/api/v4/account`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Ошибка получения информации об аккаунте:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // Проверяем наличие ошибок
    if (error) {
      console.error('Ошибка авторизации AmoCRM:', error, errorDescription)
      
      // Специальная обработка для ошибки 405
      if (error === 'invalid_request' || errorDescription?.includes('405')) {
        return NextResponse.json({
          success: false,
          error: 'Invalid OAuth2 request',
          message: 'Неправильный запрос авторизации. Проверьте настройки интеграции в AmoCRM.',
          details: {
            error,
            error_description: errorDescription,
            suggestion: 'Убедитесь, что интеграция настроена правильно и Redirect URI совпадает'
          }
        }, { status: 400 })
      }
      
      return NextResponse.json({
        success: false,
        error: 'Authorization failed',
        message: errorDescription || 'Ошибка авторизации в AmoCRM'
      }, { status: 400 })
    }

    // Проверяем наличие кода авторизации
    if (!code) {
      return NextResponse.json({
        success: false,
        error: 'Missing authorization code',
        message: 'Код авторизации не найден'
      }, { status: 400 })
    }

    console.log('Получен код авторизации AmoCRM:', code.substring(0, 10) + '...')
    console.log('State параметр:', state)

    // Обмениваем код на токен доступа
    try {
      const tokenResponse = await fetch(`https://${AMOCRM_CONFIG.subdomain}.amocrm.ru/oauth2/access_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: AMOCRM_CONFIG.clientId,
          client_secret: AMOCRM_CONFIG.clientSecret,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: AMOCRM_CONFIG.redirectUri,
        }),
      })

      if (!tokenResponse.ok) {
        const errorData: AmoCRMErrorResponse = await tokenResponse.json()
        console.error('Ошибка получения токена:', errorData)
        return NextResponse.json({
          success: false,
          error: 'Token exchange failed',
          message: errorData.error_description || 'Ошибка получения токена доступа'
        }, { status: 400 })
      }

      const tokenData: AmoCRMTokenResponse = await tokenResponse.json()
      
      console.log('Токен успешно получен:', {
        token_type: tokenData.token_type,
        expires_in: tokenData.expires_in,
        access_token: tokenData.access_token.substring(0, 10) + '...',
        refresh_token: tokenData.refresh_token.substring(0, 10) + '...'
      })

      // Получаем информацию об аккаунте для проверки
      const accountInfo = await getAccountInfo(tokenData.access_token)
      
      if (accountInfo) {
        console.log('Информация об аккаунте получена:', {
          id: accountInfo.id,
          name: accountInfo.name,
          subdomain: accountInfo.subdomain
        })
      }

      // В реальном приложении здесь нужно:
      // 1. Сохранить токены в базе данных
      // 2. Настроить автоматическое обновление токенов
      // 3. Обновить переменные окружения или конфигурацию

      return NextResponse.json({
        success: true,
        message: 'Авторизация AmoCRM успешно завершена',
        data: {
          account_id: accountInfo?.id,
          account_name: accountInfo?.name,
          subdomain: accountInfo?.subdomain,
          token_expires_in: tokenData.expires_in,
          // Не возвращаем токены в ответе по соображениям безопасности
        }
      })

    } catch (tokenError) {
      console.error('Ошибка при обмене кода на токен:', tokenError)
      return NextResponse.json({
        success: false,
        error: 'Token exchange error',
        message: 'Ошибка при обмене кода авторизации на токен доступа'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Общая ошибка в callback:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Внутренняя ошибка сервера'
    }, { status: 500 })
  }
}

// POST метод для обновления токенов
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refresh_token } = body

    if (!refresh_token) {
      return NextResponse.json({
        success: false,
        error: 'Missing refresh token',
        message: 'Токен обновления не предоставлен'
      }, { status: 400 })
    }

    const newAccessToken = await refreshAccessToken(refresh_token)

    if (!newAccessToken) {
      return NextResponse.json({
        success: false,
        error: 'Token refresh failed',
        message: 'Не удалось обновить токен доступа'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Токен успешно обновлен',
      data: {
        access_token: newAccessToken.substring(0, 10) + '...',
        expires_in: 3600 // AmoCRM токены обычно действуют 1 час
      }
    })

  } catch (error) {
    console.error('Ошибка обновления токена:', error)
    return NextResponse.json({
      success: false,
      error: 'Token refresh error',
      message: 'Ошибка при обновлении токена'
    }, { status: 500 })
  }
}
