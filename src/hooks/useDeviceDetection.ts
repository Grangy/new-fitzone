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
  
  // Оптимизированные настройки анимаций для мобильных
  const getAnimationConfig = () => {
    if (isMobile) {
      return {
        // Более консервативные настройки для мобильных
        viewport: {
          once: true,
          margin: "-50px", // Больший отступ для предотвращения повторных срабатываний
          amount: 0.1      // Меньший порог видимости
        },
        transition: {
          duration: 0.5,   // Быстрее на мобильных
          ease: [0.25, 0.46, 0.45, 0.94] as const,
          type: "tween" as const
        },
        initial: {
          opacity: 0,
          y: 20  // Меньшее расстояние для мобильных
        }
      }
    }
    
    // Настройки для десктопа
    return {
      viewport: {
        once: true,
        margin: "-30px",
        amount: 0.2
      },
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
        type: "tween" as const
      },
      initial: {
        opacity: 0,
        y: 30
      }
    }
  }

  return { isMobile, getAnimationConfig }
}
