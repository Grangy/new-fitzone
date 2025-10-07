'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react'
import { FaVk } from 'react-icons/fa'
import { useMobileOptimizedAnimations } from '../hooks/useDeviceDetection'
import { useClub } from '../contexts/ClubContext'
import { useForceUpdate } from '../hooks/useForceUpdate'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { getAnimationConfig } = useMobileOptimizedAnimations()
  const animationConfig = getAnimationConfig()
  const { selectedClub } = useClub()
  const forceUpdate = useForceUpdate()

  // Listen for club changes to trigger re-render
  useEffect(() => {
    const handleClubChange = () => {
      // Force re-render when club changes
      forceUpdate()
    }

    window.addEventListener('clubChanged', handleClubChange)
    return () => window.removeEventListener('clubChanged', handleClubChange)
  }, [forceUpdate])


  const socialLinks = [
    { icon: MessageCircle, href: selectedClub.whatsapp, label: 'WhatsApp' },
    { icon: Send, href: selectedClub.telegram, label: 'Telegram' },
    { icon: FaVk, href: selectedClub.vk, label: 'VKontakte' }
  ]

  const quickLinks = [
    { name: 'Главная', href: '#home' },
    { name: 'О нас', href: '#about-us' },
    { name: 'Направления', href: '#directions' },
    { name: 'Отзывы', href: '#reviews' },
    { name: 'Контакты', href: '#contact-form' }
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''))
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={animationConfig.initial}
            whileInView={{ opacity: 1, y: 0 }}
            transition={animationConfig.transition}
            viewport={animationConfig.viewport}
            className="lg:col-span-2 motion-safe"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-16 h-6">
                <Image
                  src="/logo.png"
                  alt="FitZone Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold">FitZone</h3>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Современный фитнес-клуб в Новороссийске. Тренируйся без клубной карты — выбирай только то, что нужно тебе.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-400" />
                <a href={`tel:${selectedClub.phone}`} className="hover:text-orange-400 transition-colors">
                  {selectedClub.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-400" />
                <span>info@fitzone-nsk.ru</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span>{selectedClub.address}</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={animationConfig.initial}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              ...animationConfig.transition,
              delay: 0.1
            }}
            viewport={animationConfig.viewport}
            className="motion-safe"
          >
            <h4 className="text-lg font-semibold mb-6">Быстрые ссылки</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-300"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Schedule & Social */}
          <motion.div
            initial={animationConfig.initial}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              ...animationConfig.transition,
              delay: 0.2
            }}
            viewport={animationConfig.viewport}
            className="motion-safe"
          >
            <h4 className="text-lg font-semibold mb-6">Режим работы</h4>
            <div className="space-y-2 mb-8">
              <div className="flex justify-between">
                <span className="text-gray-300">Пн - Пт:</span>
                <span>06:00 - 23:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Сб - Вс:</span>
                <span>08:00 - 22:00</span>
              </div>
            </div>

            <h4 className="text-lg font-semibold mb-4">Мы в соцсетях</h4>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors duration-300 group"
                >
                  <social.icon className="w-5 h-5 text-gray-300 group-hover:text-white" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Expansion Plans */}
        <motion.div
          initial={animationConfig.initial}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ 
            ...animationConfig.transition,
            delay: 0.3
          }}
          viewport={animationConfig.viewport}
          className="mt-12 pt-8 border-t border-gray-800 motion-safe"
        >
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-6 border border-orange-500/20">
            <h4 className="text-xl font-semibold mb-3 text-orange-400">
              🚀 Скоро открытие в Анапе!
            </h4>
            <p className="text-gray-300">
              Следи за новостями — уже в 2026 году FitZone откроется в Анапе. 
              Подпишись на уведомления, чтобы не пропустить старт записи.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} FitZone Новороссийск. Все права защищены.
            </p>
            
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                Пользовательское соглашение
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-300">
                Публичная оферта
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}