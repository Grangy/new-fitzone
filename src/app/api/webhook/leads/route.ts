import { NextRequest, NextResponse } from 'next/server'

interface LeadData {
  name: string
  phone: string
  direction: string
  message?: string
  timestamp: string
  source: string
  id: string
}

// Функция для проверки подписи webhook
async function verifyWebhookSignature(
  payload: string, 
  signature: string, 
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const expectedSignature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(payload)
    )
    
    const expectedHex = Array.from(new Uint8Array(expectedSignature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    return signature === expectedHex
  } catch (error) {
    console.error('Ошибка проверки подписи webhook:', error)
    return false
  }
}

// Функция для обработки лида
async function processLead(leadData: LeadData): Promise<void> {
  console.log('Обработка лида:', {
    id: leadData.id,
    name: leadData.name,
    phone: leadData.phone,
    direction: leadData.direction,
    source: leadData.source,
    timestamp: leadData.timestamp
  })

  // Здесь можно добавить логику для:
  // - Сохранения в базу данных
  // - Отправки в CRM систему
  // - Создания задач
  // - Уведомлений менеджерам
  
  // Пример: сохранение в файл (для демонстрации)
  try {
    const { promises: fs } = await import('fs')
    const path = await import('path')
    
    const leadsDir = path.join(process.cwd(), 'data', 'leads')
    await fs.mkdir(leadsDir, { recursive: true })
    
    const filename = `lead_${leadData.id}.json`
    const filepath = path.join(leadsDir, filename)
    
    await fs.writeFile(filepath, JSON.stringify(leadData, null, 2))
    console.log('Лид сохранен в файл:', filepath)
  } catch (error) {
    console.error('Ошибка сохранения лида:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('X-Webhook-Signature')
    const source = request.headers.get('X-Webhook-Source')

    // Проверяем источник
    if (source !== 'FitZone-Landing') {
      console.warn('Неизвестный источник webhook:', source)
      return NextResponse.json(
        { error: 'Unauthorized source' },
        { status: 401 }
      )
    }

    // Проверяем подпись
    const webhookSecret = process.env.WEBHOOK_SECRET || 'your-webhook-secret'
    if (!signature || !await verifyWebhookSignature(body, signature, webhookSecret)) {
      console.warn('Неверная подпись webhook')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Парсим данные лида
    const leadData: LeadData = JSON.parse(body)

    // Валидация данных
    if (!leadData.name || !leadData.phone || !leadData.direction) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Обрабатываем лид
    await processLead(leadData)

    return NextResponse.json({
      success: true,
      message: 'Lead processed successfully',
      leadId: leadData.id
    })

  } catch (error) {
    console.error('Ошибка обработки webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET метод для проверки статуса webhook
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Webhook endpoint is active',
    timestamp: new Date().toISOString(),
    endpoints: {
      'POST /api/webhook/leads': 'Receive lead data',
      'GET /api/webhook/leads': 'Check webhook status'
    }
  })
}
