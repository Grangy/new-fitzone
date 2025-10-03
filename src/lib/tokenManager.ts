// Менеджер токенов AmoCRM для хранения и обновления токенов

interface TokenData {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  created_at: number
}

// Временное хранение токенов в памяти (в продакшене использовать базу данных)
let tokenStorage: TokenData | null = null

// Конфигурация AmoCRM
const AMOCRM_CONFIG = {
  subdomain: process.env.AMOCRM_SUBDOMAIN || 'fitzonenovorosspionerskaya',
  clientId: process.env.AMOCRM_CLIENT_ID || '28598671',
  clientSecret: process.env.AMOCRM_CLIENT_SECRET || 'your-client-secret',
  redirectUri: process.env.AMOCRM_REDIRECT_URI || 'https://fitzone-new.ru/api/amocrm/callback'
}

// Функция для проверки валидности токена
export function isTokenValid(tokenData: TokenData | null): boolean {
  if (!tokenData) return false
  
  const now = Date.now()
  const expiresAt = tokenData.created_at + (tokenData.expires_in * 1000)
  // Добавляем буфер в 5 минут для безопасности
  return now < (expiresAt - 5 * 60 * 1000)
}

// Функция для получения валидного токена
export async function getValidToken(): Promise<string | null> {
  // Проверяем текущий токен
  if (isTokenValid(tokenStorage)) {
    return tokenStorage!.access_token
  }

  // Если токен истек, пытаемся обновить
  if (tokenStorage?.refresh_token) {
    console.log('Токен истек, пытаемся обновить...')
    const newTokenData = await refreshToken(tokenStorage.refresh_token)
    if (newTokenData) {
      tokenStorage = newTokenData
      return newTokenData.access_token
    }
  }

  // Если нет токена или не удалось обновить, возвращаем null
  console.log('Нет валидного токена, требуется авторизация')
  return null
}

// Функция для обновления токена
async function refreshToken(refreshToken: string): Promise<TokenData | null> {
  try {
    console.log('Обновляем токен AmoCRM...')
    
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
      const errorText = await response.text()
      console.error('Ошибка обновления токена:', response.status, errorText)
      return null
    }

    const tokenData = await response.json()
    const newTokenData: TokenData = {
      ...tokenData,
      created_at: Date.now()
    }

    console.log('Токен успешно обновлен')
    return newTokenData

  } catch (error) {
    console.error('Ошибка при обновлении токена:', error)
    return null
  }
}

// Функция для сохранения токенов (вызывается из callback)
export function saveTokens(tokenData: TokenData): void {
  tokenStorage = tokenData
  console.log('Токены сохранены:', {
    access_token: tokenData.access_token.substring(0, 10) + '...',
    expires_in: tokenData.expires_in,
    created_at: new Date(tokenData.created_at).toISOString()
  })
}

// Функция для получения информации о токене
export function getTokenInfo(): { hasToken: boolean; isValid: boolean; expiresAt?: string } {
  if (!tokenStorage) {
    return { hasToken: false, isValid: false }
  }

  const isValid = isTokenValid(tokenStorage)
  const expiresAt = new Date(tokenStorage.created_at + (tokenStorage.expires_in * 1000)).toISOString()

  return {
    hasToken: true,
    isValid,
    expiresAt
  }
}

// Функция для очистки токенов
export function clearTokens(): void {
  tokenStorage = null
  console.log('Токены очищены')
}

// Функция для проверки необходимости авторизации
export function needsAuthorization(): boolean {
  return !isTokenValid(tokenStorage)
}

// Функция для получения URL авторизации
export function getAuthUrl(): string {
  const state = Math.random().toString(36).substring(2, 15) + 
                Math.random().toString(36).substring(2, 15)
  
  const params = new URLSearchParams({
    client_id: AMOCRM_CONFIG.clientId,
    redirect_uri: AMOCRM_CONFIG.redirectUri,
    response_type: 'code',
    scope: 'crm',
    state: state
  })

  return `https://${AMOCRM_CONFIG.subdomain}.amocrm.ru/oauth2/authorize?${params.toString()}`
}
