'use client'

import { motion } from 'framer-motion'
import { X, Clock, User, Calendar } from 'lucide-react'
import { siteConfig } from '../lib/siteConfig'

interface ScheduleItem {
  day: string
  time: string
  level: string
}

interface ScheduleData {
  title: string
  trainer: string
  schedule: ScheduleItem[]
}

interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  directionId: string
}

export default function ScheduleModal({ isOpen, onClose, directionId }: ScheduleModalProps) {
  if (!isOpen) return null

  const scheduleData = siteConfig.schedules[directionId as keyof typeof siteConfig.schedules] as ScheduleData | undefined

  if (!scheduleData) {
    return null
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'начинающий':
        return 'bg-green-100 text-green-800'
      case 'средний':
        return 'bg-yellow-100 text-yellow-800'
      case 'продвинутый':
        return 'bg-red-100 text-red-800'
      case 'любой':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{scheduleData.title}</h2>
              <div className="flex items-center gap-4 text-orange-100">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm md:text-base">{scheduleData.trainer}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduleData.schedule.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-gray-900">{item.day}</span>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{item.time}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(item.level)}`}>
                    {item.level}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Важная информация</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-medium mb-2">📝 Запись на тренировки:</p>
                <p>Обязательна предварительная запись через сайт или по телефону</p>
              </div>
              <div>
                <p className="font-medium mb-2">⏰ Продолжительность:</p>
                <p>60 минут для групповых занятий, 60 минут для персональных</p>
              </div>
              <div>
                <p className="font-medium mb-2">👥 Количество мест:</p>
                <p>До 12 человек в группе, персональные тренировки - 1 на 1</p>
              </div>
              <div>
                <p className="font-medium mb-2">💰 Стоимость:</p>
                <p>От 800₽ за групповое занятие, от 2500₽ за персональное</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <p className="text-sm text-gray-600">
              Есть вопросы? Звоните: <span className="font-semibold text-orange-600">+7 (8617) 123-45-67</span>
            </p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
