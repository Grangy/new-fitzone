# FitZone Landing Page

Современная посадочная страница для фитнес-клуба FitZone в Новороссийске.

## 🚀 Особенности

- **Next.js 14** с App Router
- **TypeScript** для типобезопасности
- **Tailwind CSS** для стилизации
- **Framer Motion** для анимаций
- **Lucide React** для иконок
- **Интеграция с amoCRM** для обработки заявок
- **Telegram уведомления** для мгновенного получения заявок
- **Адаптивный дизайн** для всех устройств
- **SEO оптимизация**

## 📦 Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd fitzone-landing
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env.local` и настройте переменные окружения:
```env
# amoCRM Integration
AMOCRM_SUBDOMAIN=your-subdomain
AMOCRM_CLIENT_ID=your-client-id
AMOCRM_CLIENT_SECRET=your-client-secret
AMOCRM_REDIRECT_URI=your-redirect-uri
AMOCRM_ACCESS_TOKEN=your-access-token

# Telegram Notifications (optional)
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

4. Запустите проект в режиме разработки:
```bash
npm run dev
```

## 🔧 Настройка интеграций

### amoCRM

1. Создайте интеграцию в настройках amoCRM
2. Получите Client ID, Client Secret и настройте Redirect URI
3. Получите Access Token через OAuth 2.0
4. Настройте ID полей в файле `src/app/api/crm/route.ts`

### Telegram уведомления

1. Создайте бота через @BotFather
2. Получите токен бота
3. Добавьте бота в группу или получите Chat ID личного чата
4. Укажите токен и Chat ID в переменных окружения

### Google Analytics

1. Создайте свойство в Google Analytics 4
2. Получите Measurement ID (G-XXXXXXXXXX)
3. Добавьте его в переменные окружения

## 📱 Структура проекта

```
src/
├── app/
│   ├── api/crm/          # API для интеграции с CRM
│   ├── globals.css       # Глобальные стили
│   ├── layout.tsx        # Основной layout
│   └── page.tsx          # Главная страница
├── components/
│   ├── HeroSection.tsx           # Главный экран
│   ├── AdvantagesSection.tsx     # Секция преимуществ
│   ├── DirectionsSection.tsx     # Направления тренировок
│   ├── SocialProofSection.tsx    # Тренеры и отзывы
│   ├── ContactForm.tsx           # Форма обратной связи
│   └── Footer.tsx               # Футер
```

## 🎨 Дизайн системы

### Цветовая палитра
- **Основной**: Orange (500) to Red (500) gradient
- **Фон**: Gray (50, 900)
- **Текст**: Gray (900, 600, 300)

### Компоненты
- **btn-primary**: Градиентная кнопка с эффектами hover
- **btn-secondary**: Белая кнопка с border
- **section-padding**: Стандартные отступы секций
- **container-custom**: Контейнер с максимальной шириной

## 📊 Аналитика и отслеживание

Проект поддерживает отслеживание следующих событий:
- Отправка формы заявки
- Клики по кнопкам CTA
- Просмотры секций (scroll tracking)

## 🚀 Деплой

### Vercel (рекомендуется)
```bash
npm install -g vercel
vercel
```

### Другие платформы
Проект совместим с любыми платформами, поддерживающими Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 Настройка контента

### Изменение текстов
Основные тексты находятся в компонентах. Для удобства редактирования можно вынести их в отдельные файлы конфигурации.

### Добавление направлений тренировок
Отредактируйте массив `directions` в файле `DirectionsSection.tsx`.

### Изменение контактной информации
Обновите данные в компонентах `ContactForm.tsx` и `Footer.tsx`.

## 🔒 Безопасность

- Все API ключи хранятся в переменных окружения
- Валидация данных на стороне сервера
- Защита от CSRF атак
- Санитизация пользовательского ввода

## 📞 Поддержка

Для получения поддержки или вопросов по настройке:
- Email: info@fitzone-nsk.ru
- Telegram: @fitzone_support

## 📄 Лицензия

MIT License - см. файл LICENSE для деталей.