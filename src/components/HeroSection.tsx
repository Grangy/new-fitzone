'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import BookingModal from './BookingModal'
import OptimizedVideo from './OptimizedVideo'
import VideoModal from './VideoModal'

export default function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isBannerVisible, setIsBannerVisible] = useState(true)
  const [isSticky, setIsSticky] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const videoRef = useRef<{ playVideo: () => void } | null>(null)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleBannerClick = () => {
    setIsBookingModalOpen(true)
  }

  const handleVideoPlay = () => {
    if (isMobile) {
      // На мобильных открываем модальное окно
      setIsVideoModalOpen(true)
    } else {
      // На десктопе воспроизводим как обычно
      if (!isVideoLoaded && !videoError) {
        setIsVideoPlaying(true)
        setUserInteracted(true)
      } else if (videoRef.current && videoRef.current.playVideo) {
        videoRef.current.playVideo()
      }
    }
  }

  const handleVideoLoad = () => {
    setIsVideoLoaded(true)
  }

  const handleVideoError = () => {
    setVideoError(true)
    setIsVideoPlaying(false)
  }

  const closeBanner = () => {
    setIsBannerVisible(false)
  }

  // Sticky banner logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsSticky(scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-hide banner after 15 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBannerVisible(false)
    }, 15000)

    return () => clearTimeout(timer)
  }, [])

  // Detect mobile device and auto-play logic
  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                            window.innerWidth <= 768 || 
                            ('ontouchstart' in window)
      setIsMobile(isMobileDevice)
      
      // Auto-play on desktop, manual play on mobile
      if (!isMobileDevice && !userInteracted) {
        // Small delay to ensure page is loaded
        const timer = setTimeout(() => {
          setIsVideoPlaying(true)
        }, 1000)
        return () => clearTimeout(timer)
      }
    }

    checkDevice()
    
    // Re-check on resize
    const handleResize = () => {
      const isMobileDevice = window.innerWidth <= 768
      setIsMobile(isMobileDevice)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [userInteracted])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        {isVideoPlaying && !videoError && !isMobile ? (
          <>
            <OptimizedVideo
              ref={videoRef}
              src="/video.mp4"
              poster="/video-poster.jpg"
              className="w-full h-full object-cover brightness-75"
              onLoad={handleVideoLoad}
              onError={handleVideoError}
              autoPlay={true}
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-40 pointer-events-none" />
          </>
        ) : (
          <div 
            className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80')",
              filter: "blur(2px) brightness(0.6)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          />
        )}
        <div className="absolute inset-0 video-overlay" />
      </div>

      {/* Enhanced Mobile Promotional Banner */}
      {isBannerVisible && (
        <>
          {/* Main Banner */}
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ 
              duration: 0.8, 
              type: "spring", 
              stiffness: 100,
              delay: 0.5 
            }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 px-3 sm:px-0"
          >
            <motion.button
              onClick={handleBannerClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white px-4 sm:px-6 py-3 sm:py-2 rounded-2xl sm:rounded-full text-xs sm:text-sm font-bold shadow-2xl border-2 border-white/20 backdrop-blur-sm hover:shadow-orange-500/25 transition-all duration-300 cursor-pointer touch-manipulation min-h-[44px] flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #f97316 100%)',
                boxShadow: '0 8px 32px rgba(249, 115, 22, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              {/* Pulsing animation */}
              <motion.div
                className="absolute inset-0 rounded-2xl sm:rounded-full bg-white/20"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Fire emoji with animation */}
              <motion.span 
                className="text-base sm:text-sm mr-2"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🔥
              </motion.span>
              
              {/* Text with responsive sizing */}
              <span className="relative z-10 text-center leading-tight">
                <span className="block sm:inline font-extrabold text-shadow">
                  Скидка 30%
                </span>
                <span className="block sm:inline sm:ml-1 font-medium opacity-95">
                  на первый месяц!
                </span>
              </span>
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl sm:rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1
                }}
                style={{ clipPath: 'inset(0)' }}
              />
              
              {/* Close button for mobile */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeBanner()
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800/80 text-white rounded-full flex items-center justify-center text-xs hover:bg-gray-700 transition-colors sm:hidden"
              >
                ×
              </button>
            </motion.button>
          </motion.div>

          {/* Sticky Banner for scroll */}
          {isSticky && (
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 text-center text-sm font-semibold shadow-lg"
            >
              <button
                onClick={handleBannerClick}
                className="flex items-center justify-center gap-2 w-full hover:opacity-90 transition-opacity"
              >
                <span>🔥</span>
                <span>Скидка 30% на первый месяц тренировок!</span>
                <span className="text-xs opacity-75">Нажми для записи</span>
              </button>
              <button
                onClick={closeBanner}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white text-lg"
              >
                ×
              </button>
            </motion.div>
          )}
        </>
      )}

      {/* Main Content */}
      <div className="relative z-10 text-center text-white container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Фитнес без <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">клубной карты</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            Только то, что нужно тебе. Выбирай направления, тренеров и время — плати только за результат
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="btn-primary text-lg px-10 py-4"
          >
            Записаться на тренировку
          </button>
          <button 
            onClick={() => scrollToSection('directions')}
            className="btn-secondary text-lg px-10 py-4"
          >
            Выбрать направление
          </button>
        </motion.div>

        {/* Play Video Button - Only show on mobile or when video is not playing */}
        {((isMobile && !isVideoPlaying) || (!isMobile && !isVideoPlaying && !userInteracted)) && !videoError && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onClick={handleVideoPlay}
            className="inline-flex items-center gap-3 text-white hover:text-orange-400 transition-colors duration-300 mb-16"
          >
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-opacity-30 transition-all duration-300">
              <Play className="w-6 h-6 ml-1" fill="currentColor" />
            </div>
            <span className="text-lg font-medium">
              {isMobile ? 'Посмотреть видео о клубе' : 'Воспроизвести видео'}
            </span>
          </motion.button>
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <button 
          onClick={() => scrollToSection('advantages')}
          className="text-white hover:text-orange-400 transition-colors duration-300 animate-bounce"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      </motion.div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />

      {/* Video Modal for Mobile */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoSrc="/video.mp4"
        poster="/video-poster.jpg"
      />
    </section>
  )
}

