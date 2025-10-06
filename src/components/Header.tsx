'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone, MapPin, ChevronDown, Instagram, MessageCircle, Send } from 'lucide-react'
import { useClub, ClubData } from '../contexts/ClubContext'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isClubDropdownOpen, setIsClubDropdownOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { selectedClub, setSelectedClub, clubs } = useClub()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isClubDropdownOpen) {
        const target = event.target as Element
        if (!target.closest('.club-dropdown')) {
          setIsClubDropdownOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isClubDropdownOpen])

  // Progressive club selection function
  const selectClub = (club: ClubData) => {
    setSelectedClub(club)
    setIsClubDropdownOpen(false)
    // Page will reload automatically due to context logic
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  const navigationItems = [
    { name: 'Главная', href: 'home' },
    { name: 'Групповые', href: 'directions' },
    { name: 'Индивидуальные', href: 'individual-trainings' },
    { name: 'Контакты', href: 'contact-form' }
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className="relative w-20 h-8 lg:w-24 lg:h-10">
              <Image
                src="/logo.png"
                alt="FitZone Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigationItems.map((item, index) => (
              <motion.button
                key={index}
                onClick={() => scrollToSection(item.href)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`font-medium transition-colors duration-300 ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-orange-500' 
                    : 'text-white hover:text-orange-300'
                }`}
              >
                {item.name}
              </motion.button>
            ))}
          </nav>

          {/* Club Selector & Contact Info */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Club Selector */}
            <div className="relative club-dropdown">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsClubDropdownOpen(!isClubDropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                  isScrolled
                    ? 'border-gray-200 bg-white text-gray-700 hover:border-orange-500'
                    : 'border-white/30 bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Выбрать клуб</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                  isClubDropdownOpen ? 'rotate-180' : ''
                }`} />
              </motion.button>

              <AnimatePresence>
                {isClubDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                  >
                    {clubs.map((club) => (
                      <button
                        key={club.id}
                        onClick={() => selectClub(club)}
                        className={`w-full px-4 py-4 text-left hover:bg-orange-50 transition-all duration-200 border-b border-gray-100 last:border-b-0 ${
                          selectedClub.id === club.id 
                            ? 'bg-orange-50 text-orange-600 border-l-4 border-l-orange-500' 
                            : 'text-gray-700 hover:text-orange-600'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <MapPin className={`w-5 h-5 mt-0.5 ${
                            selectedClub.id === club.id ? 'text-orange-500' : 'text-gray-400'
                          }`} />
                          <div className="flex-1">
                            <div className="font-semibold text-base mb-1">{club.name}</div>
                            <div className="text-sm text-gray-600 leading-relaxed">{club.address}</div>
                            {selectedClub.id === club.id && (
                              <div className="text-xs text-orange-500 font-medium mt-1">
                                ✓ Выбран
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-4">
              {/* Phone */}
              <motion.a
                href={`tel:${selectedClub.phone}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isScrolled
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Позвонить</span>
              </motion.a>

              {/* Social Links */}
              <div className="flex items-center gap-2">
                <motion.a
                  href={selectedClub.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isScrolled
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </motion.a>

                <motion.a
                  href={selectedClub.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isScrolled
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  aria-label="Telegram"
                >
                  <Send className="w-5 h-5" />
                </motion.a>

                <motion.a
                  href={selectedClub.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isScrolled
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
              isScrolled
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white/95 backdrop-blur-md rounded-xl mt-2 p-4 shadow-lg"
            >
              {/* Club Selector for Mobile */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Выберите клуб:
                </h3>
                <div className="space-y-3">
                  {clubs.map((club) => (
                    <button
                      key={club.id}
                      onClick={() => selectClub(club)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 border-2 ${
                        selectedClub.id === club.id
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-orange-50 hover:border-orange-200 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className={`w-5 h-5 mt-0.5 ${
                          selectedClub.id === club.id ? 'text-white' : 'text-gray-400'
                        }`} />
                        <div className="flex-1">
                          <div className="font-semibold text-base mb-1">{club.name}</div>
                          <div className="text-sm opacity-75 leading-relaxed">{club.address}</div>
                          {selectedClub.id === club.id && (
                            <div className="text-xs text-orange-100 font-medium mt-1">
                              ✓ Выбран
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2 mb-6">
                {navigationItems.map((item, index) => (
                  <motion.button
                    key={index}
                    onClick={() => scrollToSection(item.href)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-left p-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-300"
                  >
                    {item.name}
                  </motion.button>
                ))}
              </nav>

              {/* Contact Info for Mobile */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-5 h-5 text-orange-500" />
                  <a
                    href={`tel:${selectedClub.phone}`}
                    className="text-gray-700 font-medium"
                  >
                    {selectedClub.phone}
                  </a>
                </div>

                <div className="flex gap-3">
                  <motion.a
                    href={selectedClub.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </motion.a>

                  <motion.a
                    href={selectedClub.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg text-center font-medium hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Telegram
                  </motion.a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
