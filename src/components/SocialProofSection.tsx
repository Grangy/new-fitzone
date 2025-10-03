'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useMobileOptimizedAnimations } from '../hooks/useDeviceDetection'
import Image from 'next/image'

const trainers = [
  {
    name: 'Анна Петрова',
    specialty: 'Йога и Пилатес',
    experience: '8 лет опыта',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    certifications: ['RYT-500', 'Pilates Mat']
  },
  {
    name: 'Дмитрий Волков',
    specialty: 'Кроссфит и Функциональный тренинг',
    experience: '6 лет опыта',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    certifications: ['CrossFit L2', 'FMS']
  },
  {
    name: 'Елена Смирнова',
    specialty: 'Персональные тренировки',
    experience: '10 лет опыта',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
    certifications: ['NASM-CPT', 'Nutrition Coach']
  }
]

const testimonials = [
  {
    name: 'Мария Иванова',
    age: 28,
    text: 'Наконец-то нашла место, где можно заниматься без переплат за ненужные услуги. Хожу на йогу уже 3 месяца — результат потрясающий!',
    rating: 5,
    program: 'Йога'
  },
  {
    name: 'Алексей Козлов',
    age: 35,
    text: 'Персональные тренировки с Еленой изменили мою жизнь. Сбросил 15 кг за полгода и чувствую себя на 10 лет моложе!',
    rating: 5,
    program: 'Персональные тренировки'
  },
  {
    name: 'Ольга Петренко',
    age: 42,
    text: 'Групповые занятия — это невероятная энергия! Команда поддерживает, тренер мотивирует. Уже год не пропускаю ни одной тренировки.',
    rating: 5,
    program: 'Групповые программы'
  }
]

export default function SocialProofSection() {
  const { getAnimationConfig } = useMobileOptimizedAnimations()
  const animationConfig = getAnimationConfig()

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Trainers Section */}
        <motion.div
          initial={animationConfig.initial}
          whileInView={{ opacity: 1, y: 0 }}
          transition={animationConfig.transition}
          viewport={animationConfig.viewport}
          className="text-center mb-16 motion-safe"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Наши <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">тренеры</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Профессионалы с международными сертификатами и многолетним опытом
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {trainers.map((trainer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative">
                <Image
                  src={trainer.image}
                  alt={trainer.name}
                  width={400}
                  height={256}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {trainer.name}
                </h3>
                <p className="text-orange-500 font-semibold mb-2">
                  {trainer.specialty}
                </p>
                <p className="text-gray-600 mb-4">
                  {trainer.experience}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {trainer.certifications.map((cert, certIndex) => (
                    <span
                      key={certIndex}
                      className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Отзывы <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">клиентов</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Истории успеха наших клиентов — лучшее подтверждение качества наших услуг
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
