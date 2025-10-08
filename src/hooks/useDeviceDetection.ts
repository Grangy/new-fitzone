'use client'

import { useState, useEffect } from 'react'

export function useDeviceDetection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent
      const width = window.innerWidth
      
      // Mobile detection
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || 
                            width <= 768 || 
                            ('ontouchstart' in window)
      
      // Tablet detection
      const isTabletDevice = width > 768 && width <= 1024 && ('ontouchstart' in window)
      
      // Desktop detection
      const isDesktopDevice = width > 1024 && !('ontouchstart' in window)
      
      setIsMobile(isMobileDevice)
      setIsTablet(isTabletDevice)
      setIsDesktop(isDesktopDevice)
    }

    checkDevice()
    
    const handleResize = () => {
      checkDevice()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { isMobile, isTablet, isDesktop }
}

export function useMobileOptimizedAnimations() {
  const { isMobile } = useDeviceDetection()
  
  // Проверяем предпочтения пользователя для уменьшенных анимаций
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  // Оптимизированные настройки анимаций для мобильных
  const getAnimationConfig = () => {
    if (prefersReducedMotion) {
      // Минимальные анимации для пользователей с ограниченными возможностями
      return {
        viewport: {
          once: true,
          margin: "-100px",
          amount: 0.05
        },
        transition: {
          duration: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94] as const,
          type: "tween" as const
        },
        initial: {
          opacity: 0.8,
          y: 5
        }
      }
    }
    
    if (isMobile) {
      return {
        // Очень плавные и медленные анимации для мобильных
        viewport: {
          once: true,
          margin: "-80px", // Больший отступ для предотвращения повторных срабатываний
          amount: 0.05      // Очень маленький порог видимости
        },
        transition: {
          duration: 1.2,   // Медленнее и плавнее на мобильных
          ease: [0.16, 1, 0.3, 1] as const, // Более плавная кривая
          type: "tween" as const
        },
        initial: {
          opacity: 0,
          y: 10  // Очень маленькое расстояние для мобильных
        }
      }
    }
    
    // Настройки для десктопа
    return {
      viewport: {
        once: true,
        margin: "-50px",
        amount: 0.15
      },
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
        type: "tween" as const
      },
      initial: {
        opacity: 0,
        y: 20
      }
    }
  }

  // Функция для получения конфигурации карусели
  const getCarouselConfig = () => {
    if (prefersReducedMotion) {
      return {
        transition: {
          duration: 0.3,
          ease: [0.25, 0.46, 0.45, 0.94] as const
        }
      }
    }
    
    if (isMobile) {
      return {
        transition: {
          duration: 0.8, // Более медленные переходы карусели
          ease: [0.16, 1, 0.3, 1] as const
        }
      }
    }
    
    return {
      transition: {
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  }

  return { isMobile, getAnimationConfig, getCarouselConfig }
}
