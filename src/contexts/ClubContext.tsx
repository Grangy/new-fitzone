'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { siteConfig } from '../lib/siteConfig'

export interface ClubData {
  id: string
  name: string
  address: string
  phone: string
  whatsapp: string
  telegram: string
  vk: string
  instagram: string
  trainers: Trainer[]
  directions: Direction[]
  photos: string[]
  description: string
}

export interface Trainer {
  id: string
  name: string
  specialty: string
  experience: string
  image: string
  certifications: string[]
  bio: string
  schedule: string[]
}

export interface Direction {
  id: string
  title: string
  description: string
  image: string
  price: string
  duration: string
  level: string
  schedule: string[]
  trainer: string
}

// Экспорт конфигурации сайта
export { siteConfig }

// Интерфейс для расписания
export interface ScheduleItem {
  day: string
  time: string
  level: string
}

export interface ScheduleData {
  title: string
  trainer: string
  schedule: ScheduleItem[]
}

const clubs: ClubData[] = [
  {
    id: 'pionerskaya',
    name: 'ул. Пионерская',
    address: 'ул. Пионерская, 15',
    phone: '+7 (8617) 123-45-67',
    whatsapp: 'https://wa.me/786171234567',
    telegram: 'https://t.me/fitzone_pionerskaya',
    vk: 'https://vk.com/fitzone_pionerskaya',
    instagram: 'https://instagram.com/fitzone_pionerskaya',
    description: 'Современный фитнес-клуб в центре города с полным спектром услуг',
    trainers: [
      {
        id: 'anna-pionerskaya',
        name: 'Анна Петрова2',
        specialty: 'Йога и Пилатес',
        experience: '8 лет опыта',
        image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        certifications: ['RYT-500', 'Pilates Mat', 'Yin Yoga'],
        bio: 'Сертифицированный инструктор йоги с 8-летним опытом. Специализируется на хатха-йоге, виньяса-флоу и восстановительной йоге.',
        schedule: ['Пн, Ср, Пт: 09:00-10:00', 'Вт, Чт: 18:00-19:00']
      },
      {
        id: 'dmitry-pionerskaya',
        name: 'Дмитрий Волков',
        specialty: 'Кроссфит и Функциональный тренинг',
        experience: '6 лет опыта',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        certifications: ['CrossFit L2', 'FMS', 'Olympic Weightlifting'],
        bio: 'Мастер спорта по тяжелой атлетике. Специализируется на функциональном тренинге и кроссфите.',
        schedule: ['Пн, Ср, Пт: 07:00-08:00', 'Вт, Чт: 19:00-20:00']
      }
    ],
    directions: [
      {
        id: 'yoga-pionerskaya',
        title: 'Йога',
        description: 'Гармония тела и духа. Улучши гибкость, силу и найди внутренний баланс.',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        price: 'от 800₽',
        duration: '60 мин',
        level: 'Для всех уровней',
        schedule: ['Пн, Ср, Пт: 09:00', 'Вт, Чт: 18:00'],
        trainer: 'Анна Петрова'
      },
      {
        id: 'crossfit-pionerskaya',
        title: 'Кроссфит',
        description: 'Высокоинтенсивные функциональные тренировки для максимального результата.',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        price: 'от 1200₽',
        duration: '60 мин',
        level: 'Средний-продвинутый',
        schedule: ['Пн, Ср, Пт: 07:00', 'Вт, Чт: 19:00'],
        trainer: 'Дмитрий Волков'
      }
    ],
    photos: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ]
  },
  {
    id: 'mira',
    name: 'ул. Мира',
    address: 'ул. Мира, 42',
    phone: '+7 (8617) 234-56-78',
    whatsapp: 'https://wa.me/786172345678',
    telegram: 'https://t.me/fitzone_mira',
    vk: 'https://vk.com/fitzone_mira',
    instagram: 'https://instagram.com/fitzone_mira',
    description: 'Новый современный фитнес-центр с передовым оборудованием',
    trainers: [
      {
        id: 'elena-mira',
        name: 'Елена Смирнова',
        specialty: 'Персональные тренировки',
        experience: '10 лет опыта',
        image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        certifications: ['NASM-CPT', 'Nutrition Coach', 'TRX'],
        bio: 'Сертифицированный персональный тренер с 10-летним опытом. Специализируется на коррекции фигуры и реабилитации.',
        schedule: ['Пн-Пт: 08:00-20:00', 'Сб: 09:00-15:00']
      },
      {
        id: 'mikhail-mira',
        name: 'Михаил Козлов',
        specialty: 'Пилатес и Функциональный тренинг',
        experience: '7 лет опыта',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        certifications: ['Pilates Mat', 'Reformer', 'Functional Training'],
        bio: 'Сертифицированный инструктор пилатеса. Специализируется на работе с позвоночником и коррекции осанки.',
        schedule: ['Пн, Ср, Пт: 10:00-11:00', 'Вт, Чт: 17:00-18:00']
      }
    ],
    directions: [
      {
        id: 'pilates-mira',
        title: 'Пилатес',
        description: 'Укрепи мышцы кора, улучши осанку и координацию движений.',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        price: 'от 900₽',
        duration: '55 мин',
        level: 'Начинающий-средний',
        schedule: ['Пн, Ср, Пт: 10:00', 'Вт, Чт: 17:00'],
        trainer: 'Михаил Козлов'
      },
      {
        id: 'personal-mira',
        title: 'Персональные тренировки',
        description: 'Индивидуальный подход, персональная программа и максимальное внимание тренера.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        price: 'от 2500₽',
        duration: '60 мин',
        level: 'Любой уровень',
        schedule: ['Пн-Пт: 08:00-20:00', 'Сб: 09:00-15:00'],
        trainer: 'Елена Смирнова'
      }
    ],
    photos: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ]
  }
]

interface ClubContextType {
  selectedClub: ClubData
  setSelectedClub: (club: ClubData) => void
  clubs: ClubData[]
}

const ClubContext = createContext<ClubContextType | undefined>(undefined)

export function ClubProvider({ children }: { children: ReactNode }) {
  const [selectedClub, setSelectedClub] = useState<ClubData>(clubs[0])

  // Load saved club selection on mount
  useEffect(() => {
    const savedClub = localStorage.getItem('selectedClub')
    if (savedClub) {
      try {
        const club = JSON.parse(savedClub)
        const foundClub = clubs.find(c => c.id === club.id)
        if (foundClub) {
          setSelectedClub(foundClub)
        }
      } catch (error) {
        console.error('Error loading saved club:', error)
      }
    }
  }, [])

  // Save club selection when it changes
  useEffect(() => {
    localStorage.setItem('selectedClub', JSON.stringify(selectedClub))
  }, [selectedClub])

  const handleSetSelectedClub = (club: ClubData) => {
    setSelectedClub(club)
    // Save to localStorage
    localStorage.setItem('selectedClub', JSON.stringify(club))
    // Dispatch custom event for components to listen
    window.dispatchEvent(new CustomEvent('clubChanged', { detail: club }))
  }

  return (
    <ClubContext.Provider value={{
      selectedClub,
      setSelectedClub: handleSetSelectedClub,
      clubs
    }}>
      {children}
    </ClubContext.Provider>
  )
}

export function useClub() {
  const context = useContext(ClubContext)
  if (context === undefined) {
    throw new Error('useClub must be used within a ClubProvider')
  }
  return context
}
