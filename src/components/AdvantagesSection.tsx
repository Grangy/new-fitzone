'use client'

import { motion } from 'framer-motion'
import { useMobileOptimizedAnimations } from '../hooks/useDeviceDetection'
import { Target, Users, Dumbbell, CreditCard, Clock } from 'lucide-react'

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

export default function AdvantagesSection() {
  const { getAnimationConfig } = useMobileOptimizedAnimations()
  const animationConfig = getAnimationConfig()

  return (
    <section id="advantages" className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={animationConfig.initial}
          whileInView={{ opacity: 1, y: 0 }}
          transition={animationConfig.transition}
          viewport={animationConfig.viewport}
          className="text-center mb-16 motion-safe"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Почему выбирают <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">FitZone</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Мы создали уникальную систему, которая позволяет получать максимум от фитнеса без лишних трат
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              initial={animationConfig.initial}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                ...animationConfig.transition,
                delay: index * (animationConfig.transition.duration * 0.1) // Адаптивная задержка
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
          className="mt-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 md:p-12 text-white motion-safe"
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
      </div>
    </section>
  )
}

