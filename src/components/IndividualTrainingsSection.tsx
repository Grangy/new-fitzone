'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Award, Clock, Users, Phone, MessageCircle, Download, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { useMobileOptimizedAnimations } from '../hooks/useDeviceDetection'
import { useClub } from '../contexts/ClubContext'
import { useForceUpdate } from '../hooks/useForceUpdate'

export default function IndividualTrainingsSection() {
  const { getAnimationConfig } = useMobileOptimizedAnimations()
  const animationConfig = getAnimationConfig()
  const { selectedClub } = useClub()
  const forceUpdate = useForceUpdate()

  // Listen for club changes to trigger re-render
  useEffect(() => {
    const handleClubChange = () => {
      forceUpdate()
    }

    window.addEventListener('clubChanged', handleClubChange)
    return () => window.removeEventListener('clubChanged', handleClubChange)
  }, [forceUpdate])

  const handleAppDownload = () => {
    // Определяем устройство и открываем соответствующее приложение
    const userAgent = navigator.userAgent || navigator.vendor || ''
    
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      // iOS
      window.open('https://apps.apple.com/ru/app/fitzone/id6477537132', '_blank')
    } else if (/android/i.test(userAgent)) {
      // Android
      window.open('https://play.google.com/store/apps/details?id=fitzone.client.app&hl=ru', '_blank')
    } else {
      // Desktop - показываем оба варианта
      const choice = confirm('Выберите ваше устройство:\nOK - для iPhone/iPad\nОтмена - для Android')
      if (choice) {
        window.open('https://apps.apple.com/ru/app/fitzone/id6477537132', '_blank')
      } else {
        window.open('https://play.google.com/store/apps/details?id=fitzone.client.app&hl=ru', '_blank')
      }
    }
  }

  return (
    <section id="individual-trainings" className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Индивидуальные <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">тренировки</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Персональные тренировки с профессиональными тренерами. Максимальный результат за минимальное время.
          </p>
          <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-orange-800 font-medium">
              📍 Клуб: <span className="font-bold">{selectedClub.name}</span> - {selectedClub.address}
            </p>
          </div>
        </motion.div>

        {/* App Download Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Download className="w-8 h-8" />
            <h3 className="text-2xl font-bold">Скачайте наше приложение</h3>
          </div>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Записывайтесь на тренировки, отслеживайте прогресс и управляйте абонементом в удобном мобильном приложении
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleAppDownload}
              className="bg-white text-orange-600 font-bold py-3 px-6 rounded-xl hover:bg-orange-50 transition-colors flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Скачать приложение
            </button>
            <div className="flex gap-4 text-sm">
              <a 
                href="https://apps.apple.com/ru/app/fitzone/id6477537132" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-orange-200 transition-colors"
              >
                <span>📱</span> App Store
              </a>
              <a 
                href="https://play.google.com/store/apps/details?id=fitzone.client.app&hl=ru" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-orange-200 transition-colors"
              >
                <span>🤖</span> Google Play
              </a>
            </div>
          </div>
        </motion.div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedClub.trainers.map((trainer, index) => (
            <motion.div
              key={trainer.id}
              initial={animationConfig.initial}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                ...animationConfig.transition,
                delay: index * (animationConfig.transition.duration * 0.1)
              }}
              viewport={animationConfig.viewport}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 motion-safe"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={trainer.image}
                  alt={trainer.name}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-900">
                  {trainer.experience}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {trainer.name}
                </h3>
                <p className="text-orange-600 font-semibold mb-4">
                  {trainer.specialty}
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                  {trainer.bio}
                </p>
                
                {/* Certifications */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">Сертификации:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {trainer.certifications.map((cert, certIndex) => (
                      <span 
                        key={certIndex}
                        className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Schedule */}
                {trainer.schedule && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-700">Расписание:</span>
                    </div>
                    <div className="space-y-1">
                      {trainer.schedule.map((time, timeIndex) => (
                        <p key={timeIndex} className="text-xs text-gray-500">{time}</p>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button 
                    onClick={handleAppDownload}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Записаться в приложении
                  </button>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${selectedClub.phone}`}
                      className="px-3 py-3 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all duration-300 group"
                      title="Позвонить"
                    >
                      <Phone className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    </a>
                    <a
                      href={selectedClub.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-3 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:text-green-500 transition-all duration-300 group"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Individual Training Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Преимущества индивидуальных тренировок
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Персональный подход</h4>
              <p className="text-gray-300">Программа тренировок разрабатывается специально для вас</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Гибкое расписание</h4>
              <p className="text-gray-300">Тренируйтесь в удобное для вас время</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold mb-2">Максимальный результат</h4>
              <p className="text-gray-300">Быстрое достижение поставленных целей</p>
            </div>
          </div>
          <button 
            onClick={handleAppDownload}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105"
          >
            Скачать приложение для записи
          </button>
        </motion.div>
      </div>
    </section>
  )
}
