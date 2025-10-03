import { NextRequest, NextResponse } from 'next/server'
import { getAmoCRMAuthUrl } from '@/lib/amocrm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const returnUrl = searchParams.get('return_url') || '/'
    
    // Генерируем случайный state для безопасности
    const state = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15)
    
    // Получаем URL авторизации AmoCRM (без popup режима для избежания ошибки 405)
    const authUrl = getAmoCRMAuthUrl(state, false)
    
    console.log('Инициация авторизации AmoCRM:', {
      authUrl: authUrl.substring(0, 50) + '...',
      state: state.substring(0, 10) + '...',
      returnUrl
    })

    // В реальном приложении здесь нужно сохранить state в сессии или базе данных
    // для проверки при callback

    return NextResponse.json({
      success: true,
      auth_url: authUrl,
      state: state,
      message: 'URL авторизации AmoCRM сгенерирован'
    })

  } catch (error) {
    console.error('Ошибка генерации URL авторизации:', error)
    return NextResponse.json({
      success: false,
      error: 'Auth URL generation failed',
      message: 'Ошибка генерации URL авторизации AmoCRM'
    }, { status: 500 })
  }
}

// POST метод для прямого редиректа
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { return_url } = body
    
    // Генерируем случайный state
    const state = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15)
    
    // Получаем URL авторизации AmoCRM (без popup режима для избежания ошибки 405)
    const authUrl = getAmoCRMAuthUrl(state, false)
    
    console.log('Прямой редирект на авторизацию AmoCRM:', {
      authUrl: authUrl.substring(0, 50) + '...',
      state: state.substring(0, 10) + '...',
      returnUrl: return_url
    })

    // Возвращаем редирект
    return NextResponse.redirect(authUrl)

  } catch (error) {
    console.error('Ошибка редиректа на авторизацию:', error)
    return NextResponse.json({
      success: false,
      error: 'Auth redirect failed',
      message: 'Ошибка редиректа на авторизацию AmoCRM'
    }, { status: 500 })
  }
}
