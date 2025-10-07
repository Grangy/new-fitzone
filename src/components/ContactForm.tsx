'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, Smartphone, QrCode } from 'lucide-react'
import { useMobileOptimizedAnimations } from '../hooks/useDeviceDetection'
import { useClub } from '../contexts/ClubContext'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    direction: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [directions, setDirections] = useState<string[]>([])
  const { getAnimationConfig } = useMobileOptimizedAnimations()
  const animationConfig = getAnimationConfig()
  const { selectedClub } = useClub()

  // Parse all directions from selected club
  useEffect(() => {
    const allDirections = selectedClub.directions.map(dir => dir.title)
    setDirections(allDirections)
  }, [selectedClub])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Ошибка отправки заявки')
      }
      
      setIsSubmitted(true)
      setFormData({ name: '', phone: '', direction: '', message: '' })
      
      // Отправляем событие в Google Analytics (если настроено)
      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (window as { gtag: (command: string, action: string, parameters: Record<string, string>) => void }).gtag
        gtag('event', 'form_submit', {
          event_category: 'engagement',
          event_label: formData.direction
        })
      }
    } catch (error) {
      console.error('Ошибка отправки формы:', error)
      alert('Произошла ошибка при отправке заявки. Попробуйте еще раз или свяжитесь с нами по телефону.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (isSubmitted) {
    return (
      <section id="contact-form" className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Заявка отправлена!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Спасибо за интерес к FitZone! Наш менеджер свяжется с вами в течение 15 минут.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="btn-primary"
            >
              Отправить еще одну заявку
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact-form" className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <motion.div
            initial={animationConfig.initial}
            whileInView={{ opacity: 1, x: 0 }}
            transition={animationConfig.transition}
            viewport={animationConfig.viewport}
            className="motion-safe"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Запишись на <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">тренировку</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Оставь заявку и получи персональную консультацию по выбору программы тренировок
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Ваше имя *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-300"
                  placeholder="Введите ваше имя"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Номер телефона *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-300"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div>
                <label htmlFor="direction" className="block text-sm font-semibold text-gray-700 mb-2">
                  Выберите направление *
                </label>
                <select
                  id="direction"
                  name="direction"
                  value={formData.direction}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-300"
                >
                  <option value="">Выберите направление</option>
                  {directions.map((direction, index) => (
                    <option key={index} value={direction}>
                      {direction}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Дополнительная информация
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-300 resize-none"
                  placeholder="Расскажите о ваших целях, опыте или задайте вопрос"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Отправляем...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Записаться на тренировку
                  </>
                )}
              </button>

              <p className="text-sm text-gray-500 text-center">
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
              </p>
            </form>
          </motion.div>

          {/* Contact Info & App Download */}
          <motion.div
            initial={animationConfig.initial}
            whileInView={{ opacity: 1, x: 0 }}
            transition={animationConfig.transition}
            viewport={animationConfig.viewport}
            className="space-y-8 motion-safe"
          >
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Контактная информация
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Телефон</p>
                    <p className="text-gray-600">+7 (8617) 123-45-67</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">info@fitzone-nsk.ru</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Адрес</p>
                    <p className="text-gray-600">г. Новороссийск, ул. Советов, 10</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Режим работы</p>
                    <p className="text-gray-600">Пн-Вс: 06:00 - 23:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile App Download */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
              <div className="flex items-center gap-4 mb-6">
                <Smartphone className="w-8 h-8 text-orange-400" />
                <h3 className="text-2xl font-bold">
                  Скачай приложение FitZone
                </h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                Записывайся на тренировки, отслеживай прогресс и получай персональные рекомендации прямо в телефоне
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button className="flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <span className="text-sm">📱 Google Play</span>
                </button>
                <button className="flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <span className="text-sm">🍎 App Store</span>
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-gray-900" />
                </div>
                <div>
                  <p className="font-semibold mb-1">Сканируй QR-код</p>
                  <p className="text-sm text-gray-300">для быстрой установки</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
