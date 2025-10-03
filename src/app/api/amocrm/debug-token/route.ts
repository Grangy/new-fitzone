import { NextResponse } from 'next/server'

// AmoCRM конфигурация
const AMOCRM_CONFIG = {
  subdomain: process.env.AMOCRM_SUBDOMAIN || 'your-subdomain',
  longToken: process.env.AMOCRM_LONG_TOKEN || 'your-long-token'
}

export async function GET() {
  try {
    const token = AMOCRM_CONFIG.longToken
    
    // Анализ токена
    const analysis = {
      length: token.length,
      isJWT: token.includes('.') && token.split('.').length === 3,
      hasBearer: token.startsWith('Bearer '),
      startsWith: token.substring(0, 10),
      endsWith: token.substring(-10),
      containsSpaces: token.includes(' '),
      containsNewlines: token.includes('\n'),
      containsQuotes: token.includes('"') || token.includes("'"),
      isBase64: /^[A-Za-z0-9+/=]+$/.test(token),
      isHex: /^[0-9a-fA-F]+$/.test(token)
    }
    
    // Попробуем разные варианты токена
    const testTokens = [
      token,
      token.trim(),
      token.replace(/\s/g, ''),
      token.replace(/['"]/g, ''),
      token.startsWith('Bearer ') ? token.substring(7) : token
    ]
    
    const results = []
    
    for (let i = 0; i < testTokens.length; i++) {
      const testToken = testTokens[i]
      const testUrl = `https://${AMOCRM_CONFIG.subdomain}/api/v4/account`
      
      try {
        const response = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${testToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        results.push({
          tokenIndex: i,
          token: testToken.substring(0, 20) + '...',
          status: response.status,
          success: response.ok
        })
        
        if (response.ok) {
          const data = await response.json()
          return NextResponse.json({
            status: 'success',
            message: 'Токен найден!',
            workingToken: testToken.substring(0, 20) + '...',
            tokenIndex: i,
            account: data,
            analysis
          })
        }
      } catch (error) {
        results.push({
          tokenIndex: i,
          token: testToken.substring(0, 20) + '...',
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
    
    return NextResponse.json({
      status: 'error',
      message: 'Ни один вариант токена не работает',
      analysis,
      results,
      recommendations: [
        'Проверьте токен в AmoCRM - возможно он истек',
        'Убедитесь, что токен скопирован полностью',
        'Проверьте, что токен активирован в AmoCRM',
        'Попробуйте создать новый токен в AmoCRM'
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
