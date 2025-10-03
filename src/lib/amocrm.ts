// Утилиты для работы с AmoCRM API

interface AmoCRMTokenData {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  created_at: number
}

interface AmoCRMConfig {
  subdomain: string
  clientId: string
  clientSecret: string
  redirectUri: string
}

// Конфигурация AmoCRM
export const amocrmConfig: AmoCRMConfig = {
  subdomain: process.env.AMOCRM_SUBDOMAIN || 'your-subdomain',
  clientId: process.env.AMOCRM_CLIENT_ID || 'your-client-id',
  clientSecret: process.env.AMOCRM_CLIENT_SECRET || 'your-client-secret',
  redirectUri: process.env.AMOCRM_REDIRECT_URI || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/amocrm/callback`
}

// Функция для получения URL авторизации AmoCRM
export function getAmoCRMAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: amocrmConfig.clientId,
    redirect_uri: amocrmConfig.redirectUri,
    response_type: 'code',
    scope: 'crm'
  })

  if (state) {
    params.append('state', state)
  }

  return `https://${amocrmConfig.subdomain}.amocrm.ru/oauth2/authorize?${params.toString()}`
}

// Функция для обмена кода авторизации на токен
export async function exchangeCodeForToken(code: string): Promise<AmoCRMTokenData | null> {
  try {
    const response = await fetch(`https://${amocrmConfig.subdomain}.amocrm.ru/oauth2/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: amocrmConfig.clientId,
        client_secret: amocrmConfig.clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: amocrmConfig.redirectUri,
      }),
    })

    if (!response.ok) {
      console.error('Ошибка обмена кода на токен:', await response.text())
      return null
    }

    const tokenData = await response.json()
    
    return {
      ...tokenData,
      created_at: Date.now()
    }
  } catch (error) {
    console.error('Ошибка при обмене кода на токен:', error)
    return null
  }
}

// Функция для обновления токена доступа
export async function refreshAccessToken(refreshToken: string): Promise<AmoCRMTokenData | null> {
  try {
    const response = await fetch(`https://${amocrmConfig.subdomain}.amocrm.ru/oauth2/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: amocrmConfig.clientId,
        client_secret: amocrmConfig.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        redirect_uri: amocrmConfig.redirectUri,
      }),
    })

    if (!response.ok) {
      console.error('Ошибка обновления токена:', await response.text())
      return null
    }

    const tokenData = await response.json()
    
    return {
      ...tokenData,
      created_at: Date.now()
    }
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error)
    return null
  }
}

// Функция для проверки валидности токена
export function isTokenExpired(tokenData: AmoCRMTokenData): boolean {
  const now = Date.now()
  const expiresAt = tokenData.created_at + (tokenData.expires_in * 1000)
  return now >= expiresAt
}

// Функция для получения валидного токена доступа
export async function getValidAccessToken(tokenData: AmoCRMTokenData): Promise<string | null> {
  if (!isTokenExpired(tokenData)) {
    return tokenData.access_token
  }

  // Токен истек, обновляем его
  const newTokenData = await refreshAccessToken(tokenData.refresh_token)
  if (!newTokenData) {
    return null
  }

  return newTokenData.access_token
}

// Функция для выполнения запросов к AmoCRM API
export async function makeAmoCRMRequest(
  endpoint: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `https://${amocrmConfig.subdomain}.amocrm.ru/api/v4${endpoint}`
  
  const defaultHeaders = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }

  return fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  })
}

// Функция для создания лида в AmoCRM
export async function createLead(
  accessToken: string,
  leadData: {
    name: string
    price: number
    custom_fields_values?: Array<{
      field_id: number
      values: Array<{ value: string }>
    }>
    _embedded?: {
      contacts?: Array<{
        name: string
        custom_fields_values?: Array<{
          field_id: number
          values: Array<{ value: string }>
        }>
      }>
    }
  }
): Promise<unknown> {
  try {
    const response = await makeAmoCRMRequest('/leads', accessToken, {
      method: 'POST',
      body: JSON.stringify([leadData])
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Ошибка создания лида:', errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Ошибка при создании лида:', error)
    throw error
  }
}

// Функция для создания контакта в AmoCRM
export async function createContact(
  accessToken: string,
  contactData: {
    name: string
    custom_fields_values?: Array<{
      field_id: number
      values: Array<{ value: string }>
    }>
  }
): Promise<unknown> {
  try {
    const response = await makeAmoCRMRequest('/contacts', accessToken, {
      method: 'POST',
      body: JSON.stringify([contactData])
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Ошибка создания контакта:', errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Ошибка при создании контакта:', error)
    throw error
  }
}

// Функция для получения информации об аккаунте
export async function getAccountInfo(accessToken: string): Promise<unknown> {
  try {
    const response = await makeAmoCRMRequest('/account', accessToken, {
      method: 'GET'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Ошибка получения информации об аккаунте:', error)
    throw error
  }
}
