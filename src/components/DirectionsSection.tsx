'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
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



  const handleBookingClick = (directionTitle: string) => {
    setSelectedDirection(directionTitle)
    setIsBookingModalOpen(true)
  }

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
            Направления <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">тренировок</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Выбери то, что подходит именно тебе. Каждое направление ведут профессиональные тренеры
          </p>
          <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-orange-800 font-medium">
              📍 Клуб: <span className="font-bold">{selectedClub.name}</span> - {selectedClub.address}
            </p>
          </div>
          
          {/* Quiz Button */}
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
                    onClick={() => handleBookingClick(direction.title)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Записаться
                  </button>
                  <button 
                    onClick={() => handleScheduleClick(direction.id)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all duration-300 group"
                    title="Посмотреть расписание"
                  >
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
            onClick={() => handleBookingClick('Пробное занятие')}
            className="btn-primary text-lg px-10 py-4"
          >
            Записаться на пробное занятие
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
    </section>
  )
}
