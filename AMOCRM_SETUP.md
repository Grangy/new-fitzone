# Настройка интеграции с AmoCRM

## 🔧 Переменные окружения

Создайте файл `.env.local` в корне проекта со следующими переменными:

```env
# AmoCRM Configuration
AMOCRM_SUBDOMAIN=your-subdomain
AMOCRM_CLIENT_ID=your-client-id
AMOCRM_CLIENT_SECRET=your-client-secret
AMOCRM_REDIRECT_URI=http://localhost:3000/api/amocrm/callback
AMOCRM_ACCESS_TOKEN=your-access-token

# Base URL for the application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 📋 Настройка в AmoCRM

### 1. Создание интеграции в AmoCRM

1. Зайдите в **Настройки** → **Интеграции** → **Создать интеграцию**
2. Выберите тип: **Внешняя интеграция**
3. Заполните поля:
   - **Название**: FitZone Landing
   - **Красный URI**: `http://localhost:3000/api/amocrm/callback`
   - **Права доступа**: CRM (чтение и запись)

### 2. Получение данных для интеграции

После создания интеграции вы получите:
- **Client ID** (ID интеграции)
- **Client Secret** (Секретный ключ)
- **Subdomain** (поддомен вашего AmoCRM)

### 3. Настройка полей в AmoCRM

Создайте следующие поля в AmoCRM и запишите их ID:

#### Поля для лидов:
- **Телефон** (тип: Телефон) - ID: `264911`
- **Направление тренировки** (тип: Текст) - ID: `264913`
- **Источник** (тип: Текст) - ID: `264915`

#### Поля для контактов:
- **Телефон** (тип: Телефон) - ID: `264911`

## 🚀 Использование API

### 1. Инициация авторизации

```javascript
// Получить URL авторизации
const response = await fetch('/api/amocrm/auth')
const data = await response.json()
window.location.href = data.auth_url
```

### 2. Обработка callback

После авторизации пользователь будет перенаправлен на:
`/api/amocrm/callback?code=...&state=...`

### 3. Создание лида

```javascript
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

## 🔄 Обновление токенов

Токены AmoCRM имеют ограниченный срок действия (обычно 1 час). 
Система автоматически обновляет токены при необходимости.

### Ручное обновление токена:

```javascript
const response = await fetch('/api/amocrm/callback', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    refresh_token: 'your-refresh-token'
  })
})
```

## 📊 Мониторинг

### Логи интеграции

Все операции с AmoCRM логируются в консоль:
- Получение токенов
- Создание лидов и контактов
- Ошибки API

### Проверка статуса

```javascript
// Проверить статус интеграции
const response = await fetch('/api/amocrm/callback')
const data = await response.json()
console.log(data)
```

## 🛠️ Отладка

### Частые проблемы:

1. **Ошибка 401 (Unauthorized)**
   - Проверьте правильность токена доступа
   - Убедитесь, что токен не истек

2. **Ошибка 400 (Bad Request)**
   - Проверьте правильность ID полей
   - Убедитесь, что поля существуют в AmoCRM

3. **Ошибка 403 (Forbidden)**
   - Проверьте права доступа интеграции
   - Убедитесь, что интеграция активна

### Тестирование:

1. Запустите приложение: `npm run dev`
2. Откройте: `http://localhost:3000/api/amocrm/auth`
3. Выполните авторизацию в AmoCRM
4. Проверьте создание тестового лида

## 📝 Дополнительные настройки

### Кастомные поля

Для добавления новых полей:

1. Создайте поле в AmoCRM
2. Запишите его ID
3. Обновите `FIELD_IDS` в `/src/app/api/crm/route.ts`

### Webhooks (опционально)

Для получения уведомлений о событиях в AmoCRM:

1. Настройте webhook в AmoCRM
2. Создайте endpoint для обработки webhook'ов
3. Обработайте события в реальном времени

## 🔒 Безопасность

- Никогда не коммитьте `.env.local` в репозиторий
- Используйте HTTPS в продакшене
- Регулярно обновляйте токены доступа
- Ограничьте права интеграции до минимума
