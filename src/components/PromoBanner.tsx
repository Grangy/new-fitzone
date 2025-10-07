'use client'

import { ArrowRight, Star, Zap, Target } from 'lucide-react'

export default function PromoBanner() {

  return (
    <section className="py-8 md:py-12 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Simple Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Static geometric shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-20" />
        <div className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20" />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20" />
      </div>

      <div className="container-custom relative z-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 shadow-2xl">
          {/* Main Content Container */}
          <div className="relative w-full aspect-[21/9] md:aspect-[21/9] sm:aspect-[16/9] flex items-center">
            
            {/* Simple Polygons Background */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Static decorative polygons */}
              <div
                className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-red-600/20"
                style={{
                  clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)'
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-purple-600/20"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 0% 100%)'
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-500/20 to-cyan-500/20"
                style={{
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full px-6 md:px-12 lg:px-16 py-8 md:py-12">
              <div className="max-w-4xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
                  <Star className="w-4 h-4" />
                  <span>Специальное предложение</span>
                </div>

                {/* Main Heading */}
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                    Тренируйся
                  </span>
                  <br />
                  <span className="text-white">без ограничений</span>
                </h2>

                {/* Subheading */}
                <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
                  Современный фитнес-клуб с новейшим оборудованием. 
                  Выбери направление, которое подходит именно тебе.
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {[
                    { icon: Zap, text: "Без клубной карты" },
                    { icon: Target, text: "Персональные тренировки" },
                    { icon: Star, text: "Современное оборудование" }
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-colors"
                    >
                      <feature.icon className="w-4 h-4" />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
                  <span>Подробнее</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 md:top-8 md:right-8">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Zap className="w-8 h-8 md:w-12 md:h-12 text-orange-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
