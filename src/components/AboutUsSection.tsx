'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Target, Users, Dumbbell, CreditCard, Clock } from 'lucide-react'
import Image from 'next/image'
import { useClub } from '../contexts/ClubContext'
import { useMobileOptimizedAnimations } from '../hooks/useDeviceDetection'
import { useForceUpdate } from '../hooks/useForceUpdate'

const advantages = [
  {
    icon: Target,
    title: 'Только выбранные направления',
    description: 'Не переплачивай за то, что не используешь. Выбирай только нужные тебе тренировки и направления.'
  },
  {
    icon: Users,
    title: 'Персональные тренеры',
    description: 'Опытные сертифицированные тренеры с индивидуальным подходом к каждому клиенту.'
  },
  {
    icon: Dumbbell,
    title: 'Современное оборудование',
    description: 'Новейшие тренажеры и оборудование от ведущих мировых производителей.'
  },
  {
    icon: CreditCard,
    title: 'Гибкая система оплаты',
    description: 'Удобные способы оплаты: разовые занятия, абонементы или рекуррентные платежи.'
  },
  {
    icon: Clock,
    title: 'Удобное расписание',
    description: 'Тренировки в удобное для тебя время. Раннее утро, обед или вечер — выбирай сам.'
  }
]

export default function AboutUsSection() {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)
  const { selectedClub } = useClub()
  const { getAnimationConfig } = useMobileOptimizedAnimations()
  const animationConfig = getAnimationConfig()
  const forceUpdate = useForceUpdate()

  // Listen for club changes to trigger re-render
  useEffect(() => {
    const handleClubChange = () => {
      // Close photo modal when club changes
      setSelectedPhoto(null)
      forceUpdate()
    }

    window.addEventListener('clubChanged', handleClubChange)
    return () => window.removeEventListener('clubChanged', handleClubChange)
  }, [forceUpdate])

  const openPhoto = (index: number) => {
    setSelectedPhoto(index)
  }

  const closePhoto = () => {
    setSelectedPhoto(null)
  }

  const nextPhoto = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto((selectedPhoto + 1) % selectedClub.photos.length)
    }
  }

  const prevPhoto = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto(selectedPhoto === 0 ? selectedClub.photos.length - 1 : selectedPhoto - 1)
    }
  }

  return (
    <section id="about-us" className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={animationConfig.initial}
          whileInView={{ opacity: 1, y: 0 }}
          transition={animationConfig.transition}
          viewport={animationConfig.viewport}
          className="text-center mb-16 motion-safe"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            О <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">нас</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы создали уникальную систему, которая позволяет получать максимум от фитнеса без лишних трат
          </p>
        </motion.div>

        {/* Advantages Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              initial={animationConfig.initial}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                ...animationConfig.transition,
                delay: index * (animationConfig.transition.duration * 0.1)
              }}
              viewport={animationConfig.viewport}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 motion-safe flex flex-col h-full"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <advantage.icon className="w-8 h-8 text-white flex-shrink-0" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex-shrink-0">
                {advantage.title}
              </h3>
              <p className="text-gray-600 leading-relaxed flex-grow">
                {advantage.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={animationConfig.initial}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            ...animationConfig.transition,
            delay: 0.3
          }}
          viewport={animationConfig.viewport}
          className="mb-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 md:p-12 text-white motion-safe"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
              <div className="text-orange-100">Довольных клиентов</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">15</div>
              <div className="text-orange-100">Направлений тренировок</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">98%</div>
              <div className="text-orange-100">Положительных отзывов</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
              <div className="text-orange-100">Поддержка клиентов</div>
            </div>
          </div>
        </motion.div>

        {/* Photos Section */}
        <motion.div
          initial={animationConfig.initial}
          whileInView={{ opacity: 1, y: 0 }}
          transition={animationConfig.transition}
          viewport={animationConfig.viewport}
          className="text-center mb-16 motion-safe"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Фотографии <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">клуба</span>
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Посмотрите, как выглядит наш клуб изнутри
          </p>
          <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-orange-800 font-medium">
              📍 Клуб: <span className="font-bold">{selectedClub.name}</span> - {selectedClub.address}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedClub.photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
              onClick={() => openPhoto(index)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <Image
                  src={photo}
                  alt={`Фото клуба ${selectedClub.name} ${index + 1}`}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                      <ChevronRight className="w-6 h-6 text-gray-900" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Photo Modal */}
        {selectedPhoto !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closePhoto}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full">
              <button
                onClick={closePhoto}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={selectedClub.photos[selectedPhoto]}
                  alt={`Фото клуба ${selectedClub.name} ${selectedPhoto + 1}`}
                  width={800}
                  height={600}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />
              </motion.div>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
                {selectedPhoto + 1} / {selectedClub.photos.length}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

