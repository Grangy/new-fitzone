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
        image: '/images/trainer1.jpg',
        certifications: ['RYT-500', 'Pilates Mat', 'Yin Yoga'],
        bio: 'Сертифицированный инструктор йоги с 8-летним опытом. Специализируется на хатха-йоге, виньяса-флоу и восстановительной йоге.',
        schedule: ['Пн, Ср, Пт: 09:00-10:00', 'Вт, Чт: 18:00-19:00']
      },
      {
        id: 'dmitry-pionerskaya',
        name: 'Дмитрий Волков',
        specialty: 'Кроссфит и Функциональный тренинг',
        experience: '6 лет опыта',
        image: '/images/trainer1.jpg',
        certifications: ['CrossFit L2', 'FMS', 'Olympic Weightlifting'],
        bio: 'Мастер спорта по тяжелой атлетике. Специализируется на функциональном тренинге и кроссфите.',
        schedule: ['Пн, Ср, Пт: 07:00-08:00', 'Вт, Чт: 19:00-20:00']
      }
    ],
    directions: [
      {
        id: 'zumba-pionerskaya',
        title: 'Зумба',
        description: 'Танцевальная фитнес-программа под латиноамериканскую музыку. Сжигай калории и получай удовольствие!',
        image: '/images/trainer1.jpg',
        price: 'от 800₽',
        duration: '60 мин',
        level: 'Для всех уровней',
        schedule: ['Пн, Ср, Пт: 19:00', 'Сб: 10:00'],
        trainer: 'Анна Петрова'
      },
      {
        id: 'yoga-pionerskaya',
        title: 'Йога',
        description: 'Гармония тела и духа. Улучши гибкость, силу и найди внутренний баланс.',
        image: '/images/trainer1.jpg',
        price: 'от 800₽',
        duration: '60 мин',
        level: 'Для всех уровней',
        schedule: ['Пн, Ср, Пт: 09:00', 'Вт, Чт: 18:00'],
        trainer: 'Анна Петрова'
      },
      {
        id: 'hatha-yoga-pionerskaya',
        title: 'Хатха-йога',
        description: 'Классическая йога с акцентом на асаны и дыхательные практики. Идеально для начинающих.',
        image: '/images/trainer1.jpg',
        price: 'от 800₽',
        duration: '60 мин',
        level: 'Начинающий',
        schedule: ['Вт, Чт: 10:00', 'Сб: 11:00'],
        trainer: 'Анна Петрова'
      },
      {
        id: 'joint-gymnastics-pionerskaya',
        title: 'Суставная гимнастика',
        description: 'Мягкие упражнения для улучшения подвижности суставов и профилактики заболеваний.',
        image: '/images/trainer1.jpg',
        price: 'от 600₽',
        duration: '45 мин',
        level: 'Для всех уровней',
        schedule: ['Пн, Ср: 08:00', 'Пт: 18:30'],
        trainer: 'Анна Петрова'
      },
      {
        id: 'women-health-pionerskaya',
        title: 'Женское здоровье',
        description: 'Специальная программа для женщин, направленная на укрепление тазового дна и женского здоровья.',
        image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        price: 'от 1000₽',
        duration: '60 мин',
        level: 'Женщины',
        schedule: ['Вт, Чт: 19:30', 'Сб: 12:00'],
        trainer: 'Анна Петрова'
      },
      {
        id: 'taebo-pionerskaya',
        title: 'Тай-бо',
        description: 'Боевые искусства в фитнес-формате. Развивай координацию, силу и выносливость.',
        image: '/images/trainer1.jpg',
        price: 'от 900₽',
        duration: '60 мин',
        level: 'Средний',
        schedule: ['Пн, Ср: 20:00', 'Пт: 19:00'],
        trainer: 'Дмитрий Волков'
      }
    ],
    photos: [
      '/images/gym1.jpg',
      '/images/gym2.jpg',
      '/images/gym3.jpg'
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
        image: '/images/trainer1.jpg',
        certifications: ['NASM-CPT', 'Nutrition Coach', 'TRX'],
        bio: 'Сертифицированный персональный тренер с 10-летним опытом. Специализируется на коррекции фигуры и реабилитации.',
        schedule: ['Пн-Пт: 08:00-20:00', 'Сб: 09:00-15:00']
      },
      {
        id: 'mikhail-mira',
        name: 'Михаил Козлов',
        specialty: 'Пилатес и Функциональный тренинг',
        experience: '7 лет опыта',
        image: '/images/trainer1.jpg',
        certifications: ['Pilates Mat', 'Reformer', 'Functional Training'],
        bio: 'Сертифицированный инструктор пилатеса. Специализируется на работе с позвоночником и коррекции осанки.',
        schedule: ['Пн, Ср, Пт: 10:00-11:00', 'Вт, Чт: 17:00-18:00']
      }
    ],
    directions: [
      {
        id: 'oriental-dance-mira',
        title: 'Восточные танцы',
        description: 'Экзотические танцы Востока. Развивай пластику, грацию и женственность.',
        image: '/images/trainer1.jpg',
        price: 'от 800₽',
        duration: '60 мин',
        level: 'Для всех уровней',
        schedule: ['Пн, Ср: 19:00', 'Сб: 11:00'],
        trainer: 'Елена Смирнова'
      },
      {
        id: 'lady-dance-mira',
        title: 'Леди-денс',
        description: 'Современные женские танцы. Уверенность, сексуальность и женская энергия.',
        image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        price: 'от 900₽',
        duration: '60 мин',
        level: 'Для всех уровней',
        schedule: ['Вт, Чт: 20:00', 'Пт: 19:00'],
        trainer: 'Елена Смирнова'
      },
      {
        id: 'joint-gymnastics-mira',
        title: 'Суставная гимнастика',
        description: 'Мягкие упражнения для улучшения подвижности суставов и профилактики заболеваний.',
        image: '/images/trainer1.jpg',
        price: 'от 600₽',
        duration: '45 мин',
        level: 'Для всех уровней',
        schedule: ['Пн, Ср: 08:00', 'Пт: 18:30'],
        trainer: 'Михаил Козлов'
      },
      {
        id: 'taebo-mira',
        title: 'Тай-бо',
        description: 'Боевые искусства в фитнес-формате. Развивай координацию, силу и выносливость.',
        image: '/images/trainer1.jpg',
        price: 'от 900₽',
        duration: '60 мин',
        level: 'Средний',
        schedule: ['Пн, Ср: 20:00', 'Пт: 19:00'],
        trainer: 'Михаил Козлов'
      },
      {
        id: 'street-lifting-mira',
        title: 'Стрит-лифтинг',
        description: 'Уличные тренировки с собственным весом. Сила, выносливость и функциональность.',
        image: '/images/trainer1.jpg',
        price: 'от 1000₽',
        duration: '60 мин',
        level: 'Средний-продвинутый',
        schedule: ['Вт, Чт: 19:00', 'Сб: 10:00'],
        trainer: 'Михаил Козлов'
      },
      {
        id: 'crossfit-mira',
        title: 'Кроссфит',
        description: 'Высокоинтенсивные функциональные тренировки для максимального результата.',
        image: '/images/trainer1.jpg',
        price: 'от 1200₽',
        duration: '60 мин',
        level: 'Средний-продвинутый',
        schedule: ['Пн, Ср, Пт: 07:00', 'Вт, Чт: 19:00'],
        trainer: 'Михаил Козлов'
      }
    ],
    photos: [
      '/images/gym1.jpg',
      '/images/gym2.jpg',
      '/images/gym3.jpg'
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
