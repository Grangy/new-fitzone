'use client'

import { motion } from 'framer-motion'
import { Check, Star, Crown, Users, ArrowRight, Sparkles } from 'lucide-react'

interface SubscriptionCardProps {
  title: string
  price: string
  originalPrice?: string
  description: string
  features: string[]
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  isPopular?: boolean
  isIndividual?: boolean
  onSelect: () => void
}

const SubscriptionCard = ({ 
  title, 
  price, 
  originalPrice, 
  description, 
  features, 
  icon: Icon, 
  gradient, 
  isPopular = false,
  isIndividual = false,
  onSelect 
}: SubscriptionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className={`relative group cursor-pointer ${isPopular ? 'lg:scale-105 z-10' : ''}`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>ПОПУЛЯРНЫЙ</span>
          </div>
        </div>
      )}

      {/* Card Container */}
      <div className={`relative overflow-hidden rounded-3xl p-8 h-full ${gradient} shadow-2xl transition-all duration-500 ${
        isPopular ? 'ring-4 ring-orange-400/50' : ''
      }`}>
        
        {/* Simple Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Simple decorative elements */}
          <div className={`absolute top-0 right-0 w-32 h-32 ${isIndividual ? 'bg-white/10' : 'bg-white/5'} rounded-full`} />
          <div className={`absolute bottom-0 left-0 w-24 h-24 ${isIndividual ? 'bg-white/10' : 'bg-white/5'}`} 
               style={{ clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)' }} />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="mb-6">
            <div className={`w-16 h-16 rounded-2xl ${isIndividual ? 'bg-white/20' : 'bg-white/10'} flex items-center justify-center backdrop-blur-sm`}>
              <Icon className={`w-8 h-8 ${isIndividual ? 'text-white' : 'text-white/80'}`} />
            </div>
          </div>

          {/* Title */}
          <h3 className={`text-2xl font-bold mb-2 ${isIndividual ? 'text-white' : 'text-white/90'}`}>
            {title}
          </h3>

          {/* Description */}
          <p className={`text-sm mb-6 ${isIndividual ? 'text-white/80' : 'text-white/70'} leading-relaxed`}>
            {description}
          </p>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${isIndividual ? 'text-white' : 'text-white/90'}`}>
                {price}
              </span>
              {originalPrice && (
                <span className="text-lg text-white/50 line-through">
                  {originalPrice}
                </span>
              )}
            </div>
            <p className="text-sm text-white/60 mt-1">за месяц</p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className={`text-sm ${isIndividual ? 'text-white/90' : 'text-white/80'}`}>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={onSelect}
            className={`w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-colors duration-200 flex items-center justify-center gap-3 ${
              isPopular 
                ? 'bg-white text-orange-600 hover:bg-orange-50 shadow-lg' 
                : isIndividual
                ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30'
                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
            }`}
          >
            <span>Купить абонемент</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </motion.div>
  )
}

export default function SubscriptionsSection() {

  const subscriptions = [
    {
      title: "8 тренировок",
      price: "2 500₽",
      originalPrice: "3 000₽",
      description: "Идеально для начинающих",
      features: [
        "8 групповых тренировок",
        "Доступ к залу",
        "Персональная консультация",
        "Мобильное приложение"
      ],
      icon: Users,
      gradient: "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700",
      isPopular: false
    },
    {
      title: "12 тренировок",
      price: "3 500₽",
      originalPrice: "4 200₽",
      description: "Самый популярный выбор",
      features: [
        "12 групповых тренировок",
        "Неограниченный доступ к залу",
        "2 персональные тренировки",
        "Мобильное приложение",
        "Заморозка на 7 дней"
      ],
      icon: Star,
      gradient: "bg-gradient-to-br from-orange-500 via-red-500 to-pink-600",
      isPopular: true
    },
    {
      title: "Индивидуальная карта",
      price: "8 000₽",
      description: "Максимальная гибкость",
      features: [
        "Неограниченные тренировки",
        "Персональный тренер",
        "Индивидуальная программа",
        "Приоритетная запись",
        "Заморозка на 14 дней",
        "Эксклюзивные зоны"
      ],
      icon: Crown,
      gradient: "bg-gradient-to-br from-slate-800 via-gray-900 to-black",
      isIndividual: true
    }
  ]

  const handleSelectSubscription = (subscription: {
    title: string
    price: string
    description: string
    features: string[]
  }) => {
    // Здесь будет логика открытия модального окна оплаты
    console.log('Selected subscription:', subscription)
  }

  return (
    <section id="subscriptions" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Simple static shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full" />
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>АБОНЕМЕНТЫ</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Выбери
            </span>
            <br />
            <span className="text-gray-900">свой план</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Гибкие абонементы для любого уровня подготовки. 
            Тренируйся когда удобно, плати только за то, что используешь.
          </p>
        </div>

        {/* Subscription Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {subscriptions.map((subscription, index) => (
            <div key={index}>
              <SubscriptionCard
                {...subscription}
                onSelect={() => handleSelectSubscription(subscription)}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Не уверен в выборе? Свяжись с нами для консультации
          </p>
          <button className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
            Получить консультацию
          </button>
        </div>
      </div>
    </section>
  )
}
