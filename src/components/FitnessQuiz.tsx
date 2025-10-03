'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  Star, 
  Trophy, 
  Heart, 
  Zap, 
  Target, 
  Clock,
  Users,
  Dumbbell,
  Sparkles,
  Share2,
  RefreshCw,
  CheckCircle
} from 'lucide-react'

interface QuizQuestion {
  id: number
  question: string
  emoji: string
  options: {
    text: string
    icon: React.ComponentType<{ className?: string }>
    scores: {
      yoga: number
      pilates: number
      crossfit: number
      personal: number
      group: number
      functional: number
    }
  }[]
}

interface QuizResult {
  direction: string
  score: number
  title: string
  description: string
  benefits: string[]
  trainer: string
  price: string
  emoji: string
  color: string
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Какая у тебя основная цель?",
    emoji: "🎯",
    options: [
      {
        text: "Расслабление и гибкость",
        icon: Heart,
        scores: { yoga: 3, pilates: 2, crossfit: 0, personal: 1, group: 1, functional: 0 }
      },
      {
        text: "Похудение и тонус",
        icon: Zap,
        scores: { yoga: 1, pilates: 3, crossfit: 2, personal: 2, group: 2, functional: 2 }
      },
      {
        text: "Сила и выносливость",
        icon: Dumbbell,
        scores: { yoga: 0, pilates: 1, crossfit: 3, personal: 2, group: 1, functional: 3 }
      },
      {
        text: "Индивидуальный подход",
        icon: Target,
        scores: { yoga: 1, pilates: 1, crossfit: 1, personal: 3, group: 0, functional: 1 }
      }
    ]
  },
  {
    id: 2,
    question: "Сколько времени готов уделять тренировкам?",
    emoji: "⏰",
    options: [
      {
        text: "30-45 минут",
        icon: Clock,
        scores: { yoga: 2, pilates: 3, crossfit: 1, personal: 2, group: 2, functional: 1 }
      },
      {
        text: "60 минут",
        icon: Clock,
        scores: { yoga: 3, pilates: 2, crossfit: 2, personal: 3, group: 2, functional: 2 }
      },
      {
        text: "90+ минут",
        icon: Clock,
        scores: { yoga: 1, pilates: 1, crossfit: 3, personal: 2, group: 1, functional: 3 }
      }
    ]
  },
  {
    id: 3,
    question: "Какая атмосфера тебе ближе?",
    emoji: "🌟",
    options: [
      {
        text: "Спокойная и медитативная",
        icon: Heart,
        scores: { yoga: 3, pilates: 2, crossfit: 0, personal: 1, group: 0, functional: 0 }
      },
      {
        text: "Энергичная и мотивирующая",
        icon: Zap,
        scores: { yoga: 0, pilates: 1, crossfit: 3, personal: 1, group: 3, functional: 2 }
      },
      {
        text: "Индивидуальная и сосредоточенная",
        icon: Target,
        scores: { yoga: 1, pilates: 2, crossfit: 1, personal: 3, group: 0, functional: 1 }
      },
      {
        text: "Командная и поддерживающая",
        icon: Users,
        scores: { yoga: 1, pilates: 1, crossfit: 2, personal: 0, group: 3, functional: 2 }
      }
    ]
  },
  {
    id: 4,
    question: "Твой уровень физической подготовки?",
    emoji: "💪",
    options: [
      {
        text: "Новичок",
        icon: Star,
        scores: { yoga: 3, pilates: 3, crossfit: 0, personal: 2, group: 2, functional: 1 }
      },
      {
        text: "Средний",
        icon: Star,
        scores: { yoga: 2, pilates: 2, crossfit: 2, personal: 2, group: 2, functional: 2 }
      },
      {
        text: "Продвинутый",
        icon: Trophy,
        scores: { yoga: 1, pilates: 1, crossfit: 3, personal: 3, group: 1, functional: 3 }
      }
    ]
  },
  {
    id: 5,
    question: "Что важнее всего в тренировке?",
    emoji: "✨",
    options: [
      {
        text: "Техника и правильность",
        icon: CheckCircle,
        scores: { yoga: 3, pilates: 3, crossfit: 1, personal: 3, group: 1, functional: 2 }
      },
      {
        text: "Интенсивность и результат",
        icon: Zap,
        scores: { yoga: 0, pilates: 1, crossfit: 3, personal: 2, group: 2, functional: 3 }
      },
      {
        text: "Разнообразие упражнений",
        icon: Sparkles,
        scores: { yoga: 1, pilates: 2, crossfit: 2, personal: 2, group: 3, functional: 3 }
      }
    ]
  }
]

const results: { [key: string]: QuizResult } = {
  yoga: {
    direction: "Йога",
    score: 0,
    title: "Мастер гармонии 🧘‍♀️",
    description: "Йога идеально подходит для тех, кто ищет баланс между телом и духом. Ты цениш спокойствие и осознанность.",
    benefits: ["Улучшение гибкости", "Снижение стресса", "Укрепление мышц кора", "Улучшение осанки"],
    trainer: "Анна Петрова",
    price: "от 800₽",
    emoji: "🧘‍♀️",
    color: "from-purple-500 to-pink-500"
  },
  pilates: {
    direction: "Пилатес",
    score: 0,
    title: "Эксперт точности 🎯",
    description: "Пилатес - твой выбор! Ты любишь контролируемые движения и работу с мышцами кора.",
    benefits: ["Укрепление кора", "Улучшение осанки", "Развитие координации", "Профилактика травм"],
    trainer: "Елена Смирнова",
    price: "от 900₽",
    emoji: "🎯",
    color: "from-green-500 to-teal-500"
  },
  crossfit: {
    direction: "Кроссфит",
    score: 0,
    title: "Воин силы 💪",
    description: "Кроссфит - это твоя стихия! Ты готов к интенсивным тренировкам и быстрым результатам.",
    benefits: ["Максимальное жиросжигание", "Развитие силы", "Улучшение выносливости", "Командный дух"],
    trainer: "Дмитрий Волков",
    price: "от 1200₽",
    emoji: "💪",
    color: "from-red-500 to-orange-500"
  },
  personal: {
    direction: "Персональные тренировки",
    score: 0,
    title: "Индивидуалист 👑",
    description: "Персональные тренировки - твой путь к успеху! Ты ценишь индивидуальный подход и максимальное внимание.",
    benefits: ["100% внимания тренера", "Персональная программа", "Быстрые результаты", "Гибкий график"],
    trainer: "Любой из наших тренеров",
    price: "от 2500₽",
    emoji: "👑",
    color: "from-yellow-500 to-amber-500"
  },
  group: {
    direction: "Групповые программы",
    score: 0,
    title: "Командный игрок 🎉",
    description: "Групповые тренировки - это то, что тебе нужно! Ты любишь энергию команды и взаимную поддержку.",
    benefits: ["Мотивация группы", "Разнообразие программ", "Доступная цена", "Новые знакомства"],
    trainer: "Команда тренеров",
    price: "от 600₽",
    emoji: "🎉",
    color: "from-blue-500 to-indigo-500"
  },
  functional: {
    direction: "Функциональный тренинг",
    score: 0,
    title: "Функциональный атлет ⚡",
    description: "Функциональный тренинг - твой выбор! Ты хочешь быть сильным и ловким в повседневной жизни.",
    benefits: ["Развитие координации", "Функциональная сила", "Профилактика травм", "Улучшение баланса"],
    trainer: "Михаил Козлов",
    price: "от 1000₽",
    emoji: "⚡",
    color: "from-cyan-500 to-blue-500"
  }
}

interface FitnessQuizProps {
  onComplete: (result: QuizResult) => void
  onBooking: (direction: string) => void
}

export default function FitnessQuiz({ onComplete, onBooking }: FitnessQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [scores, setScores] = useState({
    yoga: 0,
    pilates: 0,
    crossfit: 0,
    personal: 0,
    group: 0,
    functional: 0
  })
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [savedProgress, setSavedProgress] = useState(false)

  // Сохранение прогресса в localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fitnessQuizProgress')
    if (saved) {
      const { currentQuestion: savedQ, answers: savedA, scores: savedS } = JSON.parse(saved)
      setCurrentQuestion(savedQ)
      setAnswers(savedA)
      setScores(savedS)
      setSavedProgress(true)
    }
  }, [])

  useEffect(() => {
    if (answers.length > 0) {
      localStorage.setItem('fitnessQuizProgress', JSON.stringify({
        currentQuestion,
        answers,
        scores
      }))
    }
  }, [currentQuestion, answers, scores])

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (optionIndex: number) => {
    if (isAnimating) return

    setIsAnimating(true)
    const question = questions[currentQuestion]
    const option = question.options[optionIndex]
    
    // Обновляем ответы и очки
    const newAnswers = [...answers, optionIndex]
    setAnswers(newAnswers)
    
    const newScores = { ...scores }
    Object.keys(option.scores).forEach(key => {
      newScores[key as keyof typeof scores] += option.scores[key as keyof typeof option.scores]
    })
    setScores(newScores)

    // Тактильная обратная связь
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // Показываем результат
        const maxScore = Math.max(...Object.values(newScores))
        const winnerKey = Object.keys(newScores).find(key => 
          newScores[key as keyof typeof newScores] === maxScore
        ) as keyof typeof results
        
        const finalResult = { ...results[winnerKey], score: maxScore }
        setResult(finalResult)
        setShowResult(true)
        setConfetti(true)
        onComplete(finalResult)
        
        // Очищаем сохраненный прогресс
        localStorage.removeItem('fitnessQuizProgress')
      }
      setIsAnimating(false)
    }, 300)
  }

  const goBack = () => {
    if (currentQuestion > 0 && !isAnimating) {
      setCurrentQuestion(currentQuestion - 1)
      const newAnswers = answers.slice(0, -1)
      setAnswers(newAnswers)
      
      // Пересчитываем очки
      const newScores = { yoga: 0, pilates: 0, crossfit: 0, personal: 0, group: 0, functional: 0 }
      newAnswers.forEach((answerIndex, questionIndex) => {
        const q = questions[questionIndex]
        const option = q.options[answerIndex]
        Object.keys(option.scores).forEach(key => {
          newScores[key as keyof typeof newScores] += option.scores[key as keyof typeof option.scores]
        })
      })
      setScores(newScores)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setScores({ yoga: 0, pilates: 0, crossfit: 0, personal: 0, group: 0, functional: 0 })
    setShowResult(false)
    setResult(null)
    setConfetti(false)
    localStorage.removeItem('fitnessQuizProgress')
  }

  const shareResult = () => {
    if (result && navigator.share) {
      navigator.share({
        title: `Мой результат квиза FitZone: ${result.title}`,
        text: `Я прошел квиз и мне подходит ${result.direction}! ${result.description}`,
        url: window.location.href
      })
    }
  }

  if (showResult && result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl w-full max-w-sm sm:max-w-2xl mx-auto"
      >
        {/* Конфетти эффект */}
        {confetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                initial={{ 
                  x: Math.random() * 400,
                  y: -10,
                  rotate: 0,
                  scale: 0
                }}
                animate={{ 
                  y: 400,
                  rotate: 360,
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}

        <div className="text-center">
          {/* Результат */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4 bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}>
              {result.emoji}
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 px-2">
              {result.title}
            </h2>
            <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${result.color} text-white font-semibold mb-4`}>
              {result.direction}
            </div>
          </motion.div>

          {/* Описание */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base px-2"
          >
            {result.description}
          </motion.p>

          {/* Преимущества */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6 px-2"
          >
            {result.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {benefit}
              </div>
            ))}
          </motion.div>

          {/* Информация о тренере */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gray-50 rounded-2xl p-4 mb-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Тренер</p>
                <p className="font-semibold text-gray-900">{result.trainer}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Стоимость</p>
                <p className="font-bold text-orange-500">{result.price}</p>
              </div>
            </div>
          </motion.div>

          {/* Кнопки действий */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-2 sm:gap-3 px-2"
          >
            <button
              onClick={() => onBooking(result.direction)}
              className={`flex-1 bg-gradient-to-r ${result.color} text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base`}
            >
              Записаться на {result.direction}
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={shareResult}
                className="p-2 sm:p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                title="Поделиться результатом"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                onClick={restartQuiz}
                className="p-2 sm:p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                title="Пройти заново"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl w-full max-w-sm sm:max-w-2xl mx-auto">
      {/* Прогресс бар */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Вопрос {currentQuestion + 1} из {questions.length}
          </span>
          <span className="text-sm font-bold text-orange-500">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        {savedProgress && currentQuestion === 0 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-green-600 mt-1"
          >
            ✨ Прогресс восстановлен
          </motion.p>
        )}
      </div>

      {/* Вопрос */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-6 sm:mb-8">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{question.emoji}</div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 px-2">
              {question.question}
            </h3>
          </div>

          {/* Варианты ответов */}
          <div className="grid gap-3 mb-6">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={isAnimating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group p-3 sm:p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 text-left disabled:opacity-50"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <option.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="font-medium text-sm sm:text-base text-gray-900 group-hover:text-orange-600 transition-colors">
                    {option.text}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Навигация */}
      <div className="flex justify-between items-center">
        <button
          onClick={goBack}
          disabled={currentQuestion === 0 || isAnimating}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Назад
        </button>

        <div className="flex gap-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentQuestion ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="w-16" /> {/* Spacer для центрирования индикаторов */}
      </div>
    </div>
  )
}
