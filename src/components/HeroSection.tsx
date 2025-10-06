'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, ChevronDown, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import BookingModal from './BookingModal'
import OptimizedVideo from './OptimizedVideo'
import VideoModal from './VideoModal'
import { useClub } from '../contexts/ClubContext'
import { useForceUpdate } from '../hooks/useForceUpdate'
import Image from 'next/image'

export default function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const videoRef = useRef<{ playVideo: () => void } | null>(null)
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


  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
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


  const handleBookingClick = () => {
    setIsBookingModalOpen(true)
  }


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
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
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
              backgroundImage: "url('/images/hero-bg.jpg')",
              filter: "blur(2px) brightness(0.6)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat"
            }}
          />
        )}
        <div className="absolute inset-0 video-overlay" />
      </div>


      {/* Main Content */}
      <div className="relative z-10 text-center text-white container-custom">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Logo - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 hidden md:block"
          >
            <div className="relative w-32 h-12 md:w-40 md:h-16 mx-auto">
              <Image
                src="/logo.png"
                alt="FitZone Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Фитнес без <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">клубной карты</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            Только то, что нужно тебе. Выбирай направления, тренеров и время — плати только за результат
          </p>
          <div className="mb-8">
            <p className="text-lg text-gray-300 mb-2">
              📍 {selectedClub.address}
            </p>
            <p className="text-sm text-gray-400">
              {selectedClub.description}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <button 
            onClick={handleBookingClick}
            className="btn-primary text-lg px-10 py-4 flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
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

