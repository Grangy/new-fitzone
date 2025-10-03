# Настройка интеграции с AmoCRM и Webhook системой

## 🔧 Переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
# Telegram уведомления
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id

# AmoCRM интеграция
AMOCRM_SUBDOMAIN=your-subdomain
AMOCRM_LONG_TOKEN=your-long-token

# Webhook конфигурация (опционально)
WEBHOOK_URL=https://your-external-service.com/api/leads
WEBHOOK_SECRET=your-secure-webhook-secret

# Базовая конфигурация
NEXT_PUBLIC_BASE_URL=https://fitzone-new.ru
```

## 🏢 Настройка AmoCRM

### 1. Получение LONG_TOKEN

1. Зайдите в ваш AmoCRM аккаунт
2. Перейдите в **Настройки** → **Интеграции** → **API**
3. Скопируйте **Долгосрочный токен доступа**
4. Укажите его в переменной `AMOCRM_LONG_TOKEN`

### 2. Настройка полей

Создайте следующие поля в AmoCRM и запишите их ID:

#### Поля для лидов:
- **Телефон** (тип: Телефон) - ID: `264911`
- **Направление тренировки** (тип: Текст) - ID: `264913`
- **Источник** (тип: Текст) - ID: `264915`
- **Комментарий** (тип: Текст) - ID: `264917`

### 3. Проверка интеграции

```bash
# Тест создания лида
curl -X POST https://fitzone-new.ru/api/crm \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Тест Тестов",
    "phone": "+7 (999) 123-45-67",
    "direction": "Йога",
    "message": "Тестовое сообщение"
  }'
```

## 📋 Настройка Telegram

### 1. Создание бота

1. Напишите [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Получите токен бота

### 2. Получение Chat ID

1. Добавьте бота в группу или напишите ему лично
2. Отправьте любое сообщение боту
3. Перейдите по ссылке: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Найдите `chat.id` в ответе

### 3. Настройка переменных

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=-1001234567890
```

## 🔗 Настройка Webhook

### 1. Внешний сервис

Webhook будет отправлять данные на ваш внешний сервис. Пример структуры данных:

```json
{
  "name": "Иван Иванов",
  "phone": "+7 (999) 123-45-67",
  "direction": "Йога",
  "message": "Хочу записаться на тренировку",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "source": "FitZone Landing",
  "id": "lead_1705312200000_abc123"
}
```

### 2. Заголовки запроса

Webhook отправляет следующие заголовки:

```
Content-Type: application/json
X-Webhook-Signature: <HMAC-SHA256-signature>
X-Webhook-Source: FitZone-Landing
```

### 3. Проверка подписи

Для проверки подлинности запроса:

```javascript
const crypto = require('crypto')

function verifySignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return signature === expectedSignature
}
```

## 🚀 Использование

### 1. Отправка лида

```javascript
// POST /api/crm
const response = await fetch('/api/crm', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Иван Иванов',
    phone: '+7 (999) 123-45-67',
    direction: 'Йога',
    message: 'Хочу записаться на тренировку'
  })
})
```

### 2. Получение лидов

```javascript
// POST /api/webhook/leads
// Ваш внешний сервис должен принимать POST запросы
// с данными лида и проверять подпись
```

### 3. Проверка статуса

```javascript
// GET /api/webhook/leads
const response = await fetch('/api/webhook/leads')
const status = await response.json()
```

## 📊 Структура данных лида

| Поле | Тип | Описание |
|------|-----|----------|
| `name` | string | Имя клиента |
| `phone` | string | Телефон клиента |
| `direction` | string | Направление тренировки |
| `message` | string | Дополнительное сообщение |
| `timestamp` | string | Время создания (ISO 8601) |
| `source` | string | Источник лида |
| `id` | string | Уникальный ID лида |

## 🔒 Безопасность

### 1. Проверка подписи

Все webhook запросы подписываются HMAC-SHA256:

```javascript
const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(JSON.stringify(leadData))
  .digest('hex')
```

### 2. Проверка источника

Заголовок `X-Webhook-Source` должен быть `FitZone-Landing`

### 3. HTTPS

Используйте только HTTPS для webhook URL

## 🛠️ Отладка

### 1. Логи

Все операции логируются в консоль:

```bash
# Запуск в режиме разработки
npm run dev

# Проверка логов
tail -f logs/app.log
```

### 2. Тестирование webhook

```bash
# Тест отправки лида
curl -X POST https://fitzone-new.ru/api/crm \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Тест Тестов",
    "phone": "+7 (999) 123-45-67",
    "direction": "Йога"
  }'
```

### 3. Проверка статуса

```bash
# Проверка webhook endpoint
curl https://fitzone-new.ru/api/webhook/leads
```

## 📝 Примеры интеграции

### 1. AmoCRM

```javascript
// В вашем внешнем сервисе
app.post('/api/leads', async (req, res) => {
  const { name, phone, direction, message } = req.body
  
  // Создание лида в AmoCRM
  const lead = {
    name: `Заявка от ${name}`,
    custom_fields_values: [
      { field_id: 123, values: [{ value: phone }] },
      { field_id: 124, values: [{ value: direction }] }
    ]
  }
  
  await amocrm.leads.create(lead)
  res.json({ success: true })
})
```

### 2. Битрикс24

```javascript
// В вашем внешнем сервисе
app.post('/api/leads', async (req, res) => {
  const { name, phone, direction } = req.body
  
  // Создание лида в Битрикс24
  const lead = {
    TITLE: `Заявка от ${name}`,
    PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
    SOURCE_ID: 'WEB'
  }
  
  await bitrix24.crm.lead.add(lead)
  res.json({ success: true })
})
```

### 3. База данных

```javascript
// В вашем внешнем сервисе
app.post('/api/leads', async (req, res) => {
  const leadData = req.body
  
  // Сохранение в базу данных
  await db.leads.create({
    name: leadData.name,
    phone: leadData.phone,
    direction: leadData.direction,
    message: leadData.message,
    created_at: new Date(leadData.timestamp),
    source: leadData.source
  })
  
  res.json({ success: true })
})
```

## 🚀 Развертывание

### 1. Переменные окружения

Установите переменные окружения на сервере:

```bash
export TELEGRAM_BOT_TOKEN="your-token"
export TELEGRAM_CHAT_ID="your-chat-id"
export WEBHOOK_URL="https://your-service.com/api/leads"
export WEBHOOK_SECRET="your-secret-key"
```

### 2. Проверка работы

```bash
# Проверка статуса
curl https://fitzone-new.ru/api/webhook/leads

# Тест отправки
curl -X POST https://fitzone-new.ru/api/crm \
  -H "Content-Type: application/json" \
  -d '{"name":"Тест","phone":"+79991234567","direction":"Йога"}'
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи в консоли
2. Убедитесь в правильности переменных окружения
3. Проверьте доступность webhook URL
4. Проверьте подпись webhook

## 🔄 Миграция с AmoCRM

Если у вас была интеграция с AmoCRM:

1. Удалите все AmoCRM переменные окружения
2. Настройте webhook URL на ваш сервис
3. Настройте Telegram уведомления
4. Протестируйте отправку лидов
