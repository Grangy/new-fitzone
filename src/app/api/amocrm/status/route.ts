import { NextResponse } from 'next/server'
import { getTokenInfo, needsAuthorization, getAuthUrl } from '@/lib/tokenManager'

export async function GET() {
  try {
    const tokenInfo = getTokenInfo()
    const needsAuth = needsAuthorization()
    
    return NextResponse.json({
      success: true,
      status: {
        hasToken: tokenInfo.hasToken,
        isValid: tokenInfo.isValid,
        needsAuthorization: needsAuth,
        expiresAt: tokenInfo.expiresAt,
        authUrl: needsAuth ? getAuthUrl() : null
      },
      message: needsAuth 
        ? 'Требуется авторизация в AmoCRM' 
        : 'Интеграция с AmoCRM активна'
    })

  } catch (error) {
    console.error('Ошибка проверки статуса AmoCRM:', error)
    return NextResponse.json({
      success: false,
      error: 'Status check failed',
      message: 'Ошибка проверки статуса интеграции'
    }, { status: 500 })
  }
}
