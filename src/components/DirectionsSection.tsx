'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Download, ExternalLink, Phone, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import BookingModal from './BookingModal'
import FitnessQuiz from './FitnessQuiz'
import ScheduleModal from './ScheduleModal'
import { useMobileOptimizedAnimations } from '../hooks/useDeviceDetection'
import { useClub } from '../contexts/ClubContext'
import { useForceUpdate } from '../hooks/useForceUpdate'

export default function DirectionsSection() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedDirection, setSelectedDirection] = useState('')
  const [showQuiz, setShowQuiz] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [selectedDirectionId, setSelectedDirectionId] = useState('')
  const [quizResult, setQuizResult] = useState<{
    direction: string;
    score: number;
    title: string;
    description: string;
  } | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedDetails, setSelectedDetails] = useState<any>(null)
  const { getAnimationConfig } = useMobileOptimizedAnimations()
  const animationConfig = getAnimationConfig()
  const { selectedClub } = useClub()
  const forceUpdate = useForceUpdate()

  // Listen for club changes to trigger re-render
  useEffect(() => {
    const handleClubChange = () => {
      // Force re-render when club changes
      setSelectedDirection('')
      setQuizResult(null)
      forceUpdate()
    }

    window.addEventListener('clubChanged', handleClubChange)
    return () => window.removeEventListener('clubChanged', handleClubChange)
  }, [forceUpdate])




  const handleQuizComplete = (result: {
    direction: string;
    score: number;
    title: string;
    description: string;
  }) => {
    setQuizResult(result)
  }

  const handleQuizBooking = (direction: string) => {
    setShowQuiz(false)
    setSelectedDirection(direction)
    setIsBookingModalOpen(true)
  }

  const handleScheduleClick = (directionId: string) => {
    setSelectedDirectionId(directionId)
    setIsScheduleModalOpen(true)
  }

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
      // Desktop - открываем App Store по умолчанию
      window.open('https://apps.apple.com/ru/app/fitzone/id6477537132', '_blank')
    }
  }

  const handleBookingClick = (directionId: string) => {
    setSelectedDirectionId(directionId)
    setIsBookingModalOpen(true)
  }

  const handleDetailsClick = (item: any, type: 'direction' | 'trainer') => {
    setSelectedDetails({ ...item, type })
    setIsDetailsModalOpen(true)
  }

  return (
    <section id="directions" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Наши <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">тренировки</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Групповые и индивидуальные тренировки. Выбери то, что подходит именно тебе
          </p>
        </motion.div>

        {/* Quiz Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <motion.button
            onClick={() => setShowQuiz(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Sparkles className="w-6 h-6" />
            <span>Пройти квиз &ldquo;Найди свое направление&rdquo;</span>
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
              2 мин
            </div>
          </motion.button>
          
          {/* Quiz Result Hint */}
          {quizResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl"
            >
              <p className="text-green-800 text-sm">
                ✨ Квиз пройден! Рекомендуем: <strong>{quizResult.direction}</strong>
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Group Trainings */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Групповые тренировки</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {selectedClub.directions.map((direction, index) => (
            <motion.div
              key={index}
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
                  src={direction.image}
                  alt={direction.title}
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-900">
                  {direction.price}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {direction.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {direction.description}
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                  <span>⏱️ {direction.duration}</span>
                  <span>📊 {direction.level}</span>
                </div>
                
                {direction.schedule && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Расписание:</p>
                    <div className="space-y-1">
                      {direction.schedule.map((time, timeIndex) => (
                        <p key={timeIndex} className="text-xs text-gray-500">{time}</p>
                      ))}
                    </div>
                  </div>
                )}
                
                {direction.trainer && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Тренер: <span className="font-medium text-orange-600">{direction.trainer}</span></p>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleBookingClick(direction.id)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Записаться
                  </button>
                  <button
                    onClick={() => handleDetailsClick(direction, 'direction')}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all duration-300 group"
                    title="Подробнее"
                  >
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        </div>

        {/* Individual Trainings */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Индивидуальные тренировки</h3>
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
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {trainer.name}
                  </h4>
                  <p className="text-orange-600 font-semibold mb-4">
                    {trainer.specialty}
                  </p>
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                    {trainer.bio}
                  </p>
                  
                  {/* Certifications */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">Сертификации:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {trainer.certifications.slice(0, 2).map((cert, certIndex) => (
                        <span 
                          key={certIndex}
                          className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleBookingClick(trainer.id)}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Записаться
                    </button>
                    <button
                      onClick={() => handleDetailsClick(trainer, 'trainer')}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all duration-300 group"
                      title="Подробнее"
                    >
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


        {/* App Download Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Download className="w-8 h-8" />
            <h3 className="text-2xl font-bold">Скачайте наше приложение</h3>
          </div>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Записывайтесь на групповые тренировки, отслеживайте расписание и управляйте абонементом в удобном мобильном приложении
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

        {/* Special Offer */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Не можешь выбрать? Попробуй всё!
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Получи пробное занятие в любом направлении всего за 500₽ и найди то, что подходит именно тебе
          </p>
          <button 
            onClick={handleAppDownload}
            className="btn-primary text-lg px-10 py-4"
          >
            Записаться на пробное занятие в приложении
          </button>
        </motion.div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-sm sm:max-w-2xl lg:max-w-4xl mx-auto my-4 sm:my-8 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowQuiz(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-lg transition-colors text-lg sm:text-xl"
            >
              ×
            </button>
            <FitnessQuiz
              onComplete={handleQuizComplete}
              onBooking={handleQuizBooking}
            />
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        selectedDirection={selectedDirection}
      />

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        directionId={selectedDirectionId}
      />

      {/* Details Modal */}
      {isDetailsModalOpen && selectedDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedDetails.title}
                </h2>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowRight className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Описание</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedDetails.description}
                  </p>
                </div>

                {/* Trainer info for directions */}
                {selectedDetails.type === 'direction' && selectedDetails.trainer && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Тренер</h3>
                    <p className="text-gray-600">{selectedDetails.trainer}</p>
                  </div>
                )}

                {/* Schedule for directions */}
                {selectedDetails.type === 'direction' && selectedDetails.schedule && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Расписание</h3>
                    <div className="space-y-2">
                      {selectedDetails.schedule.map((time: string, index: number) => (
                        <div key={index} className="bg-orange-50 px-3 py-2 rounded-lg">
                          <span className="text-orange-800 font-medium">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trainer details for trainers */}
                {selectedDetails.type === 'trainer' && (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Специализация</h3>
                      <p className="text-orange-600 font-medium">{selectedDetails.specialty}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Опыт</h3>
                      <p className="text-gray-600">{selectedDetails.experience}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Сертификации</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDetails.certifications.map((cert: string, index: number) => (
                          <span key={index} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Контакты</h3>
                      <div className="flex gap-4">
                        <a
                          href={`tel:${selectedClub.phone}`}
                          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          Позвонить
                        </a>
                        <a
                          href={selectedClub.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </>
                )}

                {/* App download suggestion */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Download className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">Скачайте наше приложение</h3>
                  </div>
                  <p className="text-orange-100 mb-4">
                    Управляйте записями, отслеживайте расписание и получайте уведомления
                  </p>
                  <button
                    onClick={handleAppDownload}
                    className="bg-white text-orange-600 font-semibold py-2 px-4 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    Скачать приложение
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
