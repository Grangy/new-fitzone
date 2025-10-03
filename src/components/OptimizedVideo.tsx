'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface OptimizedVideoProps {
  src: string
  poster?: string
  className?: string
  onLoad?: () => void
  onError?: () => void
}

export default function OptimizedVideo({ 
  src, 
  poster, 
  className = '', 
  onLoad, 
  onError 
}: OptimizedVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Intersection Observer для ленивой загрузки
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded && !hasError) {
            setIsInView(true)
            // Загружаем видео только когда оно в области видимости
            video.load()
          }
        })
      },
      { 
        rootMargin: '50px',
        threshold: 0.1 
      }
    )

    observerRef.current.observe(video)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [isLoaded, hasError])

  const handleLoadedData = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  const handleCanPlay = () => {
    // Видео готово к воспроизведению
    if (videoRef.current) {
      videoRef.current.play().catch(console.error)
    }
  }

  return (
    <div className="relative w-full h-full">
      {/* Poster изображение пока видео не загружено */}
      {!isLoaded && !hasError && poster && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${poster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}

      {/* Fallback для ошибок */}
      {hasError && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-lg mb-2">Видео недоступно</p>
            <p className="text-sm opacity-75">Попробуйте обновить страницу</p>
          </div>
        </div>
      )}

      {/* Видео элемент */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${className}`}
        poster={poster}
        preload="none"
        muted
        loop
        playsInline
        onLoadedData={handleLoadedData}
        onError={handleError}
        onCanPlay={handleCanPlay}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        {isInView && (
          <source src={src} type="video/mp4" />
        )}
      </video>

      {/* Индикатор загрузки */}
      {!isLoaded && !hasError && isInView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="text-white text-center">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm">Загрузка видео...</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
