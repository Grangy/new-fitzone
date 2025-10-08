'use client'

import { useEffect, useRef } from 'react'
import { observeElement } from '../lib/resourceOptimizer'

interface AnalyticsOptimizedProps {
  children: React.ReactNode
}

export default function AnalyticsOptimized({ children }: AnalyticsOptimizedProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const analyticsLoaded = useRef(false)

  useEffect(() => {
    if (!containerRef.current || analyticsLoaded.current) return

    const loadAnalytics = () => {
      if (analyticsLoaded.current) return
      analyticsLoaded.current = true

      // Загружаем Yandex Metrica только после взаимодействия пользователя
      setTimeout(() => {
        const script = document.createElement('script')
        script.src = 'https://mc.yandex.ru/metrika/tag.js'
        script.async = true
        script.onload = () => {
          if (typeof window !== 'undefined' && window.ym) {
            // ID метрики из переменной окружения или хардкод
            const metricaId = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID || 'XXXXXX'
            window.ym(metricaId, 'init', {
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              webvisor: false
            })
          }
        }
        document.head.appendChild(script)
      }, 2000)
    }

    // Загружаем аналитику при первом взаимодействии пользователя
    const events: (keyof DocumentEventMap)[] = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    const handleUserInteraction = () => {
      loadAnalytics()
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction)
      })
    }

    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction)
    })

    // Альтернативно: загружаем через Intersection Observer при скролле
    if (containerRef.current) {
      observeElement(containerRef.current, loadAnalytics, {
        rootMargin: '100px',
        threshold: 0.1
      })
    }

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction)
      })
    }
  }, [])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}

// Расширяем Window interface для TypeScript
declare global {
  interface Window {
    ym: (id: string, method: string, options?: Record<string, unknown>) => void
  }
}
