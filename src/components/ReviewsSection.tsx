'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useMobileOptimizedAnimations } from '../hooks/useDeviceDetection'
import { useForceUpdate } from '../hooks/useForceUpdate'

const testimonials = [
  {
    name: 'Мария Иванова',
    age: 28,
    text: 'Наконец-то нашла место, где можно заниматься без переплат за ненужные услуги. Хожу на йогу уже 3 месяца — результат потрясающий!',
    rating: 5,
    program: 'Йога',
    club: 'ул. Пионерская'
  },
  {
    name: 'Алексей Козлов',
    age: 35,
    text: 'Персональные тренировки с Еленой изменили мою жизнь. Сбросил 15 кг за полгода и чувствую себя на 10 лет моложе!',
    rating: 5,
    program: 'Персональные тренировки',
    club: 'ул. Мира'
  },
  {
    name: 'Ольга Петренко',
    age: 42,
    text: 'Групповые занятия — это невероятная энергия! Команда поддерживает, тренер мотивирует. Уже год не пропускаю ни одной тренировки.',
    rating: 5,
    program: 'Групповые программы',
    club: 'ул. Пионерская'
  },
  {
    name: 'Дмитрий Соколов',
    age: 31,
    text: 'Кроссфит в FitZone — это адреналин и результат! Тренер Дмитрий профессионал своего дела. Рекомендую всем!',
    rating: 5,
    program: 'Кроссфит',
    club: 'ул. Пионерская'
  },
  {
    name: 'Анна Волкова',
    age: 26,
    text: 'Пилатес помог мне восстановиться после родов. Тренер Михаил очень внимательный и профессиональный.',
    rating: 5,
    program: 'Пилатес',
    club: 'ул. Мира'
  },
  {
    name: 'Сергей Морозов',
    age: 45,
    text: 'Функциональный тренинг — это то, что нужно для активной жизни. Чувствую себя молодым и энергичным!',
    rating: 5,
    program: 'Функциональный тренинг',
    club: 'ул. Мира'
  }
]

export default function ReviewsSection() {
  const { getAnimationConfig } = useMobileOptimizedAnimations()
  const animationConfig = getAnimationConfig()
  const forceUpdate = useForceUpdate()

  // Listen for club changes to trigger re-render
  useEffect(() => {
    const handleClubChange = () => {
      forceUpdate()
    }

    window.addEventListener('clubChanged', handleClubChange)
    return () => window.removeEventListener('clubChanged', handleClubChange)
  }, [forceUpdate])

  return (
    <section id="reviews" className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={animationConfig.initial}
          whileInView={{ opacity: 1, y: 0 }}
          transition={animationConfig.transition}
          viewport={animationConfig.viewport}
          className="text-center mb-16 motion-safe"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Отзывы <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">клиентов</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Истории успеха наших клиентов — лучшее подтверждение качества наших услуг
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={animationConfig.initial}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                ...animationConfig.transition,
                delay: index * (animationConfig.transition.duration * 0.1)
              }}
              viewport={animationConfig.viewport}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative motion-safe"
            >
              <Quote className="w-8 h-8 text-orange-500 mb-4" />
              
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {testimonial.age} лет • {testimonial.program}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    {testimonial.club}
                  </p>
                </div>
                
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Success Stories Video */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Истории трансформации
          </h3>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            Посмотри, как наши клиенты достигли своих целей и изменили свою жизнь к лучшему
          </p>
          <button className="bg-white text-orange-500 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
            Смотреть истории успеха
          </button>
        </motion.div>
      </div>
    </section>
  )
}
