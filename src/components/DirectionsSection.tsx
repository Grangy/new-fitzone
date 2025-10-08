'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Download, ExternalLink, Phone, MessageCircle, X, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import BookingModal from './BookingModal'
import FitnessQuiz from './FitnessQuiz'
import ScheduleModal from './ScheduleModal'
import PaymentModal from './PaymentModal'
import TrainersCarousel from './TrainersCarousel'
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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedDetails, setSelectedDetails] = useState<{
    title?: string;
    name?: string;
    description?: string;
    bio?: string;
    trainer?: string;
    schedule?: string[];
    specialty?: string;
    experience?: string;
    certifications?: string[];
    image?: string;
    type: 'direction' | 'trainer';
  } | null>(null)
  const { getAnimationConfig } = useMobileOptimizedAnimations()
  const animationConfig = getAnimationConfig()
  const { selectedClub } = useClub()
  const forceUpdate = useForceUpdate()

  // Функция для рандомной сортировки тренеров
  const getRandomizedTrainers = () => {
    return [...selectedClub.trainers].sort(() => Math.random() - 0.5)
  }

  // Получаем рандомно отсортированных тренеров
  const randomizedTrainers = getRandomizedTrainers()

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

  // Handle ESC key to close quiz
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showQuiz) {
        setShowQuiz(false)
      }
    }

    if (showQuiz) {
      document.addEventListener('keydown', handleEscKey)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [showQuiz])




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

  const handleDetailsClick = (item: {
    title?: string;
    name?: string;
    description?: string;
    bio?: string;
    trainer?: string;
    schedule?: string[];
    specialty?: string;
    experience?: string;
    certifications?: string[];
    image?: string;
  }, type: 'direction' | 'trainer') => {
    setSelectedDetails({ ...item, type })
    setIsDetailsModalOpen(true)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDetailsModalOpen(false)
    }
  }


  // Функция для преобразования расписания в матричный формат
  const createScheduleMatrix = (schedule: string[]) => {
    const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
    const matrix: Record<string, string[]> = {}
    
    days.forEach(day => {
      matrix[day] = []
    })

    schedule.forEach(timeSlot => {
      const [day, time] = timeSlot.split(': ')
      if (matrix[day]) {
        matrix[day].push(time)
      }
    })

    return matrix
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsDetailsModalOpen(false)
    }
  }

  useEffect(() => {
    if (isDetailsModalOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isDetailsModalOpen])

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
            Наши <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">направления</span>
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
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 motion-safe cursor-pointer"
              onClick={() => handleDetailsClick(direction, 'direction')}
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
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                    8 тренировок
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                    12 тренировок
                  </div>
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
                
                
                
                  <div className="flex gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBookingClick(direction.id)
                      }}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Записаться
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDetailsClick(direction, 'direction')
                      }}
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

        {/* Individual Trainings - New Swiper Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Наши <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">тренеры</span>
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Профессиональные тренеры с многолетним опытом помогут вам достичь поставленных целей
            </p>
          </div>
          
          <TrainersCarousel
            trainers={randomizedTrainers}
            onBookingClick={handleBookingClick}
            onDetailsClick={handleDetailsClick}
            selectedClub={selectedClub}
          />
        </motion.div>


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
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
          onClick={(e) => {
            // Close modal when clicking on overlay
            if (e.target === e.currentTarget) {
              setShowQuiz(false)
            }
          }}
        >
          <div className="relative w-full max-w-sm sm:max-w-2xl lg:max-w-4xl mx-auto my-4 sm:my-8 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowQuiz(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-lg transition-colors hover:bg-gray-50"
              aria-label="Закрыть квиз"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
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
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  {/* Trainer Photo */}
                  {selectedDetails.type === 'trainer' && (
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-orange-200 shadow-lg">
                        <Image
                          src={selectedDetails.image || '/images/trainers/no.png'}
                          alt={selectedDetails.name || ''}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedDetails.title || selectedDetails.name}
                    </h2>
                    {selectedDetails.type === 'trainer' && (
                      <p className="text-orange-600 font-medium mt-1">Персональный тренер</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Описание</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedDetails.description || selectedDetails.bio}
                  </p>
                </div>


                {/* Schedule for directions */}
                {selectedDetails.type === 'direction' && selectedDetails.schedule && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Расписание занятий</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedDetails.schedule.map((time: string, index: number) => {
                        const [day, timeSlot] = time.split(': ')
                        return (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {day}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 text-sm">{day}</div>
                                  <div className="text-gray-500 text-xs">День недели</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-blue-600 text-lg">{timeSlot}</div>
                                <div className="text-gray-500 text-xs">Время</div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Trainer details for trainers */}
                {selectedDetails.type === 'trainer' && (
                  <>
                    {/* Schedule for trainers - Matrix View */}
                    {selectedDetails.schedule && (
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">Расписание тренера</h3>
                        </div>
                        
                        {/* Schedule Matrix */}
                        <div className="bg-white rounded-xl p-2 md:p-4 shadow-lg border border-orange-200">
                          {/* Desktop Matrix View */}
                          <div className="hidden sm:grid grid-cols-8 gap-1 md:gap-2 text-xs">
                            {/* Header */}
                            <div className="font-bold text-gray-700 text-center py-2">День</div>
                            {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map(day => (
                              <div key={day} className="font-bold text-gray-700 text-center py-2 bg-orange-100 rounded-lg">
                                {day}
                              </div>
                            ))}
                            
                            {/* Schedule rows */}
                            {(() => {
                              const scheduleMatrix = createScheduleMatrix(selectedDetails.schedule)
                              const maxSlots = Math.max(...Object.values(scheduleMatrix).map(slots => slots.length))
                              const rows = []
                              
                              for (let i = 0; i < maxSlots; i++) {
                                rows.push(
                                  <div key={i} className="contents">
                                    <div className="font-medium text-gray-600 text-center py-2 text-xs">
                                      {i === 0 ? 'Время' : ''}
                                    </div>
                                    {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map(day => {
                                      const timeSlot = scheduleMatrix[day][i]
                                      return (
                                        <div key={day} className="text-center py-1">
                                          {timeSlot ? (
                                            <div className="bg-orange-500 text-white px-1 md:px-2 py-1 rounded-lg text-xs font-medium shadow-sm">
                                              {timeSlot}
                                            </div>
                                          ) : (
                                            <div className="text-gray-300 text-xs">-</div>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                )
                              }
                              return rows
                            })()}
                          </div>

                          {/* Mobile Compact View */}
                          <div className="sm:hidden">
                            {(() => {
                              const scheduleMatrix = createScheduleMatrix(selectedDetails.schedule)
                              const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
                              return days.map(day => {
                                const timeSlots = scheduleMatrix[day]
                                if (timeSlots.length === 0) return null
                                
                                return (
                                  <div key={day} className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                      {day}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {timeSlots.map((time, index) => (
                                        <div key={index} className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                                          {time}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )
                              })
                            })()}
                          </div>
                        </div>
                      </div>
                    )}

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

                {/* Buy subscription buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsDetailsModalOpen(false)
                      setIsPaymentModalOpen(true)
                    }}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>8 тренировок - 2 500₽</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsDetailsModalOpen(false)
                      setIsPaymentModalOpen(true)
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>12 тренировок - 3 500₽</span>
                  </motion.button>
                </div>

                {/* App download suggestion */}
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Download className="w-6 h-6 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Скачайте наше приложение</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Управляйте записями, отслеживайте расписание и получайте уведомления
                  </p>
                  <button
                    onClick={handleAppDownload}
                    className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Скачать приложение
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        subscription={{
          title: "8 тренировок",
          price: "2 500₽",
          description: "Идеально для начинающих",
          features: [
            "8 групповых тренировок",
            "Доступ к залу",
            "Персональная консультация",
            "Мобильное приложение"
          ]
        }}
      />
    </section>
  )
}
