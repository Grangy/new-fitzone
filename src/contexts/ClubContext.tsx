'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { siteConfig } from '../lib/siteConfig'
import { getGroupPrograms, formatSchedule, TrainerSchedule, GroupProgram, getTrainersWithPhotos } from '../lib/scheduleService'

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
  coordinates: { lat: number; lng: number }
}

export interface Trainer {
  id: string
  name: string
  image: string
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

// Функция для преобразования данных тренеров из schedule.json
function createTrainersFromSchedule(trainersData: TrainerSchedule[], clubId: string): Trainer[] {
  return trainersData.map((trainer, index) => ({
    id: `${clubId}-trainer-${index}`,
    name: trainer.name,
    image: trainer.photo || '/images/trainers/no.png',
    schedule: formatSchedule(trainer.schedule)
  }))
}

// Функция для преобразования групповых программ из schedule.json
function createDirectionsFromSchedule(programsData: GroupProgram[], clubId: string): Direction[] {
  const programDescriptions: Record<string, string> = {
    'BELLY_DANCE': 'Экзотические танцы Востока. Развивай пластику, грацию и женственность.',
    'LADY_DANCE': 'Современные женские танцы. Уверенность, сексуальность и женская энергия.',
    'MOBILITY': 'Мягкие упражнения для улучшения подвижности суставов и профилактики заболеваний.',
    'STREETLIFTING': 'Уличные тренировки с собственным весом. Сила, выносливость и функциональность.',
    'CROSSFIT': 'Высокоинтенсивные функциональные тренировки для максимального результата.',
    'TAE-BO': 'Боевые искусства в фитнес-формате. Развивай координацию, силу и выносливость.',
    'ZYMBA': 'Танцевальная фитнес-программа под латиноамериканскую музыку. Сжигай калории и получай удовольствие!',
    'YOGA_INTENSIV': 'Интенсивная практика йоги для продвинутых. Углубленная работа с телом и сознанием.',
    'HATHA_YOGA': 'Классическая йога с акцентом на асаны и дыхательные практики. Идеально для начинающих.',
    'IMBILDING': 'Специальная программа для женщин, направленная на укрепление тазового дна и женского здоровья.'
  }

  const programTitles: Record<string, string> = {
    'BELLY_DANCE': 'Восточные танцы',
    'LADY_DANCE': 'Леди-денс',
    'MOBILITY': 'Суставная гимнастика',
    'STREETLIFTING': 'Стрит-лифтинг',
    'CROSSFIT': 'Кроссфит',
    'TAE-BO': 'Тай-бо',
    'ZYMBA': 'Зумба',
    'YOGA_INTENSIV': 'Интенсивная йога',
    'HATHA_YOGA': 'Хатха-йога',
    'IMBILDING': 'Женское здоровье'
  }

  return programsData.map((program, index) => ({
    id: `${clubId}-program-${index}`,
    title: programTitles[program.name] || program.name,
    description: programDescriptions[program.name] || 'Групповая тренировка для всех уровней подготовки.',
    image: '/images/trainer1.jpg',
    price: 'от 800₽',
    duration: '60 мин',
    level: 'Для всех уровней',
    schedule: formatSchedule(program.schedule),
    trainer: 'Инструктор'
  }))
}

const clubs: ClubData[] = [
  {
    id: 'pionerskaya',
    name: 'ул. Пионерская',
    address: 'Пионерская ул., 2В, Новороссийск',
    phone: '+7 (8617) 123-45-67',
    whatsapp: 'https://wa.me/786171234567',
    telegram: 'https://t.me/fitzone_pionerskaya',
    vk: 'https://vk.com/fitzone_pionerskaya',
    instagram: 'https://instagram.com/fitzone_pionerskaya',
    description: 'Современный фитнес-клуб в центре города с полным спектром услуг',
    coordinates: { lat: 44.687617, lng: 37.791586 },
    trainers: createTrainersFromSchedule(getTrainersWithPhotos('ПИОНЕРСКАЯ'), 'pionerskaya'),
    directions: createDirectionsFromSchedule(getGroupPrograms('ПИОНЕРСКАЯ'), 'pionerskaya'),
    photos: [
      '/images/gym1.jpg',
      '/images/gym2.jpg',
      '/images/gym3.jpg'
    ]
  },
  {
    id: 'mira',
    name: 'ул. Мира',
    address: 'ул. Мира, 1А, Новороссийск (этаж 2)',
    phone: '+7 (8617) 234-56-78',
    whatsapp: 'https://wa.me/786172345678',
    telegram: 'https://t.me/fitzone_mira',
    vk: 'https://vk.com/fitzone_mira',
    instagram: 'https://instagram.com/fitzone_mira',
    description: 'Новый современный фитнес-центр с передовым оборудованием',
    coordinates: { lat: 44.726687, lng: 37.767512 },
    trainers: createTrainersFromSchedule(getTrainersWithPhotos('МИРА'), 'mira'),
    directions: createDirectionsFromSchedule(getGroupPrograms('МИРА'), 'mira'),
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
