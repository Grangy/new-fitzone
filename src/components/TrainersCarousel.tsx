'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface Trainer {
  id: string
  name: string
  image: string
  schedule: string[]
}

interface TrainersCarouselProps {
  trainers: Trainer[]
  onBookingClick: (trainerId: string) => void
  onDetailsClick: (trainer: Trainer, type: 'trainer') => void
}

export default function TrainersCarousel({ 
  trainers, 
  onBookingClick, 
  onDetailsClick
}: TrainersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleSlides, setVisibleSlides] = useState(1)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [mouseStart, setMouseStart] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Получаем количество оригинальных тренеров (без дублирования)
  const originalLength = trainers.length

  // Обработка свайпов на мобильных устройствах
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrevious()
    }
  }

  // Функция для получения количества видимых слайдов в зависимости от размера экрана
  const getVisibleSlides = () => {
    if (typeof window === 'undefined') return 1
    
    const width = window.innerWidth
    if (width < 640) return 1      // Мобильные: 1 слайд
    if (width < 768) return 1.5    // Малые планшеты: 1.5 слайда
    if (width < 1024) return 2     // Планшеты: 2 слайда
    if (width < 1280) return 3     // Небольшие ноутбуки: 3 слайда
    return 4                       // Большие экраны: 4 слайда
  }

  // Обновляем количество видимых слайдов при изменении размера окна
  useState(() => {
    const updateVisibleSlides = () => {
      setVisibleSlides(getVisibleSlides())
    }
    
    updateVisibleSlides()
    window.addEventListener('resize', updateVisibleSlides)
    
    return () => window.removeEventListener('resize', updateVisibleSlides)
  })

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1
      if (newIndex < 0) {
        // Переходим к последнему слайду
        return originalLength - 1
      }
      return newIndex
    })
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1
      if (newIndex >= originalLength) {
        // Переходим к первому слайду
        return 0
      }
      return newIndex
    })
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!trainers || trainers.length === 0) {
    return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Тренеры не найдены</p>
      </div>
    )
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Навигация */}
      <div className="flex justify-center items-center gap-4 mb-8">
        <button
          onClick={goToPrevious}
          className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Предыдущий тренер"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
        
        <div className="flex gap-2">
          {trainers.map((_, index) => (
          <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
              }`}
              aria-label={`Перейти к тренеру ${index + 1}`}
            />
          ))}
        </div>
        
        <button
          onClick={goToNext}
          className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Следующий тренер"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Карусель */}
      <div 
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={carouselRef}
      >
        <div 
          className="flex gap-4 transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)`
          }}
        >
          {trainers.map((trainer) => (
            <div 
              key={trainer.id} 
              className="flex-shrink-0"
              style={{ width: `calc(${100 / visibleSlides}% - 1rem)` }}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
                {/* Изображение тренера */}
                <div 
                  className="relative aspect-[3/4] flex-shrink-0 cursor-pointer"
                  onClick={() => onDetailsClick({
                    id: trainer.id,
                    name: trainer.name,
                    image: trainer.image,
                    schedule: trainer.schedule
                  }, 'trainer')}
                >
                  <Image
                    src={trainer.image}
                    alt={`Фото тренера ${trainer.name}`}
                    fill
                    className="object-cover object-top transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  />
                  
                  {/* Бейдж */}
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Тренер
                  </div>

                  {/* Overlay для индикации кликабельности */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-2">
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Информация о тренере */}
                <div className="p-3 flex flex-col flex-1">
                  {/* Имя тренера - полное */}
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2 truncate">
                    {trainer.name}
                  </h3>
                  
                  {/* Расписание - компактное */}
                  <div className="mb-3 flex-1">
                    <h4 className="text-xs font-medium text-gray-700 mb-1">Расписание:</h4>
                    <div className="space-y-1">
                      {trainer.schedule.slice(0, visibleSlides >= 3 ? 1 : 1).map((schedule, idx) => (
                        <div key={idx} className="bg-orange-50 text-orange-800 px-2 py-1 rounded text-xs truncate">
                          {schedule}
                      </div>
                      ))}
                      {trainer.schedule.length > 1 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{trainer.schedule.length - 1} еще
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Кнопки - вертикально для экономии места */}
                  <div className="space-y-2 mt-auto">
                    <button 
                      onClick={() => onBookingClick(trainer.id)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
                    >
                      Записаться
                    </button>
                    <button
                      onClick={() => onDetailsClick({
                        id: trainer.id,
                        name: trainer.name,
                        image: trainer.image,
                        schedule: trainer.schedule
                      }, 'trainer')}
                      className="w-full border border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-sm py-2 px-3"
                    >
                      Подробнее
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      </div>
    </div>
  )
}

