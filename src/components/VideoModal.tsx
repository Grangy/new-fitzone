'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Volume2, VolumeX } from 'lucide-react'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoSrc: string
  poster?: string
}

export default function VideoModal({ isOpen, onClose, videoSrc, poster }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Сброс состояния при открытии/закрытии
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(false)
      setIsMuted(true)
      setIsLoading(false)
      setHasError(false)
      
      // Автоматический запуск видео через небольшую задержку
      const timer = setTimeout(() => {
        handlePlay()
      }, 500) // 500ms задержка для плавного появления модального окна
      
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handlePlay = async () => {
    if (videoRef.current) {
      try {
        setIsLoading(true)
        await videoRef.current.play()
        setIsPlaying(true)
        setIsLoading(false)
      } catch (error) {
        console.error('Ошибка воспроизведения видео:', error)
        setHasError(true)
        setIsLoading(false)
      }
    }
  }

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setIsPlaying(false)
    onClose()
  }

  const handleVideoClick = () => {
    if (isPlaying) {
      handlePause()
    } else {
      handlePlay()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-900">
              <h3 className="text-white text-lg font-semibold">
                Видео о клубе FitZone
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors duration-200 p-2"
                aria-label="Закрыть видео"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video bg-black">
              {hasError ? (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <p className="text-lg mb-2">Ошибка загрузки видео</p>
                    <p className="text-sm opacity-75">Попробуйте обновить страницу</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Video Element */}
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    poster={poster}
                    className="w-full h-full object-cover cursor-pointer"
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                    onClick={handleVideoClick}
                    onLoadStart={() => setIsLoading(true)}
                    onCanPlay={() => setIsLoading(false)}
                    onError={() => {
                      setHasError(true)
                      setIsLoading(false)
                    }}
                    onEnded={() => setIsPlaying(false)}
                  />

                  {/* Loading Overlay */}
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="text-white text-center">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-sm">Загрузка видео...</p>
                      </div>
                    </div>
                  )}

                  {/* Play/Pause Overlay - показываем только если видео не воспроизводится */}
                  {!isLoading && !hasError && !isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={handleVideoClick}
                        className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-opacity-30 transition-all duration-300"
                        aria-label="Воспроизведение"
                      >
                        <Play className="w-8 h-8 text-white ml-1" />
                      </button>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <button
                      onClick={handleToggleMute}
                      className="w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all duration-200"
                      aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>

                    <div className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
                      {isPlaying ? 'Воспроизведение' : 'Нажмите на видео для воспроизведения'}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-900 text-center">
              <p className="text-gray-300 text-sm">
                Узнайте больше о нашем фитнес-клубе
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
