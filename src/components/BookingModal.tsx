'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Phone, Calendar, MessageSquare, CheckCircle } from 'lucide-react'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDirection?: string
}

const directions = [
  'Йога',
  'Пилатес', 
  'Кроссфит',
  'Индивидуальные тренировки',
  'Групповые программы'
]

export default function BookingModal({ isOpen, onClose, selectedDirection }: BookingModalProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    direction: selectedDirection || '',
    message: ''
  })

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Сброс состояния при закрытии
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1)
        setIsSuccess(false)
        setFormData({
          name: '',
          phone: '',
          direction: selectedDirection || '',
          message: ''
        })
      }, 300)
    }
  }, [isOpen, selectedDirection])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/crm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          onClose()
        }, 3000)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0
      case 2:
        return formData.phone.trim().length > 0 && formData.direction.trim().length > 0
      case 3:
        return true
      default:
        return false
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
        onClick={handleOverlayClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md mx-auto my-4 sm:my-8 max-h-[95vh] sm:max-h-[90vh] overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 sm:p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl sm:text-2xl font-bold mb-2 pr-8">
              Записаться на тренировку
            </h2>
            <p className="text-orange-100 text-sm sm:text-base">
              {selectedDirection ? `Направление: ${selectedDirection}` : 'Выберите удобное время и направление'}
            </p>
            
            {/* Progress Bar */}
            <div className="mt-4 flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    i <= step ? 'bg-white' : 'bg-white bg-opacity-30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] sm:max-h-none">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Заявка отправлена!
                </h3>
                <p className="text-gray-600">
                  Мы свяжемся с вами в ближайшее время для подтверждения записи
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <User className="w-5 h-5 text-orange-500" />
                          Как вас зовут?
                        </h3>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Введите ваше имя"
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          autoFocus
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-4 mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-orange-500" />
                            Контактная информация
                          </h3>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+7 (999) 123-45-67"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 mb-4"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-orange-500" />
                            Направление тренировки
                          </label>
                          <select
                            name="direction"
                            value={formData.direction}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                          >
                            <option value="">Выберите направление</option>
                            {directions.map((direction) => (
                              <option key={direction} value={direction}>
                                {direction}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-orange-500" />
                          Дополнительная информация
                        </h3>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Расскажите о ваших целях, предпочтениях по времени или задайте вопросы (необязательно)"
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none"
                        />
                      </div>

                      {/* Summary */}
                      <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Ваша заявка:</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><span className="font-medium">Имя:</span> {formData.name}</p>
                          <p><span className="font-medium">Телефон:</span> {formData.phone}</p>
                          <p><span className="font-medium">Направление:</span> {formData.direction}</p>
                          {formData.message && (
                            <p><span className="font-medium">Сообщение:</span> {formData.message}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-2 sm:py-3 px-4 sm:px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 text-sm sm:text-base"
                    >
                      Назад
                    </button>
                  )}
                  
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                    >
                      Далее
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                    >
                      {isSubmitting ? 'Отправляем...' : 'Записаться'}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
