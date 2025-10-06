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
      zumba: number
      taebo: number
      yoga_hatha: number
      joint_gymnastics: number
      women_health: number
      oriental_dance: number
      lady_dance: number
      street_lifting: number
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
  key?: string
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
        scores: { yoga: 3, pilates: 2, crossfit: 0, personal: 1, group: 1, functional: 0, zumba: 1, taebo: 0, yoga_hatha: 3, joint_gymnastics: 2, women_health: 2, oriental_dance: 1, lady_dance: 1, street_lifting: 0 }
      },
      {
        text: "Похудение и тонус",
        icon: Zap,
        scores: { yoga: 1, pilates: 3, crossfit: 2, personal: 2, group: 2, functional: 2, zumba: 3, taebo: 2, yoga_hatha: 1, joint_gymnastics: 1, women_health: 3, oriental_dance: 2, lady_dance: 2, street_lifting: 1 }
      },
      {
        text: "Сила и выносливость",
        icon: Dumbbell,
        scores: { yoga: 0, pilates: 1, crossfit: 3, personal: 2, group: 1, functional: 3, zumba: 0, taebo: 0, yoga_hatha: 0, joint_gymnastics: 0, women_health: 0, oriental_dance: 0, lady_dance: 0, street_lifting: 0 }
      },
      {
        text: "Индивидуальный подход",
        icon: Target,
        scores: { yoga: 1, pilates: 1, crossfit: 1, personal: 3, group: 0, functional: 1, zumba: 0, taebo: 0, yoga_hatha: 0, joint_gymnastics: 0, women_health: 0, oriental_dance: 0, lady_dance: 0, street_lifting: 0 }
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
        scores: { yoga: 2, pilates: 3, crossfit: 1, personal: 2, group: 2, functional: 1, zumba: 0, taebo: 0, yoga_hatha: 0, joint_gymnastics: 0, women_health: 0, oriental_dance: 0, lady_dance: 0, street_lifting: 0 }
      },
      {
        text: "60 минут",
        icon: Clock,
        scores: { yoga: 3, pilates: 2, crossfit: 2, personal: 3, group: 2, functional: 2, zumba: 0, taebo: 0, yoga_hatha: 0, joint_gymnastics: 0, women_health: 0, oriental_dance: 0, lady_dance: 0, street_lifting: 0 }
      },
      {
        text: "90+ минут",
        icon: Clock,
        scores: { yoga: 1, pilates: 1, crossfit: 3, personal: 2, group: 1, functional: 3, zumba: 0, taebo: 0, yoga_hatha: 0, joint_gymnastics: 0, women_health: 0, oriental_dance: 0, lady_dance: 0, street_lifting: 0 }
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
        scores: { yoga: 3, pilates: 2, crossfit: 0, personal: 1, group: 0, functional: 0, zumba: 0, taebo: 0, yoga_hatha: 0, joint_gymnastics: 0, women_health: 0, oriental_dance: 0, lady_dance: 0, street_lifting: 0 }
      },
      {
        text: "Энергичная и мотивирующая",
        icon: Zap,
        scores: { yoga: 0, pilates: 1, crossfit: 3, personal: 1, group: 3, functional: 2, zumba: 0, taebo: 0, yoga_hatha: 0, joint_gymnastics: 0, women_health: 0, oriental_dance: 0, lady_dance: 0, street_lifting: 0 }
      },
      {
        text: "Индивидуальная и сосредоточенная",
        icon: Target,
        scores: { yoga: 1, pilates: 2, crossfit: 1, personal: 3, group: 0, functional: 1, zumba: 0, taebo: 0, yoga_hatha: 0, joint_gymnastics: 0, women_health: 0, oriental_dance: 0, lady_dance: 0, street_lifting: 0 }
      },
      {
        text: "Командная и поддерживающая",
        icon: Users,
        scores: { yoga: 1, pilates: 1, crossfit: 2, personal: 0, group: 3, functional: 2, zumba: 0, taebo: 0, yoga_hatha: 0, joint_gymnastics: 0, women_health: 0, oriental_dance: 0, lady_dance: 0, street_lifting: 0 }
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
        scores: { yoga: 3, pilates: 3, crossfit: 0, personal: 2, group: 2, functional: 1, zumba: 0, taebo: 0, yoga_hatha: 0, joint_gymnastics: 0, women_health: 0, oriental_dance: 0, lady_dance: 0, street_lifting: 0 }
      },
      {
        text: "Средний",
        icon: Star,
        scores: { yoga: 2, pilates: 2, crossfit: 2, personal: 2, group: 2, functional: 2, zumba: 0, taebo: 0, yoga_hatha: 0, joint_gymnastics: 0, women_health: 0, oriental_dance: 0, lady_dance: 0, street_lifting: 0 }
      },
      {
        text: "Продвинутый",
        icon: Trophy,
        scores: { yoga: 1, pilates: 1, crossfit: 3, personal: 3, group: 1, functional: 3, zumba: 0, taebo: 0, yoga_hatha: 0, joint_gymnastics: 0, women_health: 0, oriental_dance: 0, lady_dance: 0, street_lifting: 0 }
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
        scores: { yoga: 3, pilates: 3, crossfit: 1, personal: 3, group: 1, functional: 2, zumba: 0, taebo: 0, yoga_hatha: 0, joint_gymnastics: 0, women_health: 0, oriental_dance: 0, lady_dance: 0, street_lifting: 0 }
      },
      {
        text: "Интенсивность и результат",
        icon: Zap,
        scores: { yoga: 0, pilates: 1, crossfit: 3, personal: 2, group: 2, functional: 3, zumba: 0, taebo: 0, yoga_hatha: 0, joint_gymnastics: 0, women_health: 0, oriental_dance: 0, lady_dance: 0, street_lifting: 0 }
      },
      {
        text: "Разнообразие упражнений",
        icon: Sparkles,
        scores: { yoga: 1, pilates: 2, crossfit: 2, personal: 2, group: 3, functional: 3, zumba: 0, taebo: 0, yoga_hatha: 0, joint_gymnastics: 0, women_health: 0, oriental_dance: 0, lady_dance: 0, street_lifting: 0 }
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
  },
  zumba: {
    direction: "Зумба",
    score: 0,
    title: "Танцор жизни 💃",
    description: "Зумба - это твоя страсть! Ты любишь танцы, музыку и энергичные движения.",
    benefits: ["Кардио-тренировка", "Сжигание калорий", "Улучшение координации", "Хорошее настроение"],
    trainer: "Анна Петрова",
    price: "от 800₽",
    emoji: "💃",
    color: "from-pink-500 to-purple-500"
  },
  taebo: {
    direction: "Тай-бо",
    score: 0,
    title: "Боец духа 🥊",
    description: "Тай-бо - твой стиль! Ты хочешь развить силу, координацию и уверенность в себе.",
    benefits: ["Развитие силы", "Улучшение координации", "Снятие стресса", "Повышение уверенности"],
    trainer: "Дмитрий Волков",
    price: "от 900₽",
    emoji: "🥊",
    color: "from-red-500 to-orange-500"
  },
  yoga_hatha: {
    direction: "Хатха-йога",
    score: 0,
    title: "Мастер равновесия 🧘",
    description: "Хатха-йога - твой путь! Ты ищешь баланс между силой и гибкостью.",
    benefits: ["Улучшение гибкости", "Укрепление мышц", "Снижение стресса", "Улучшение осанки"],
    trainer: "Елена Смирнова",
    price: "от 800₽",
    emoji: "🧘",
    color: "from-green-500 to-teal-500"
  },
  joint_gymnastics: {
    direction: "Суставная гимнастика",
    score: 0,
    title: "Хранитель здоровья 🦴",
    description: "Суставная гимнастика - твой выбор! Ты заботишься о здоровье суставов и подвижности.",
    benefits: ["Улучшение подвижности", "Профилактика травм", "Снятие напряжения", "Общее оздоровление"],
    trainer: "Михаил Козлов",
    price: "от 600₽",
    emoji: "🦴",
    color: "from-blue-500 to-cyan-500"
  },
  women_health: {
    direction: "Женское здоровье",
    score: 0,
    title: "Забота о себе 🌸",
    description: "Женское здоровье - твой приоритет! Ты хочешь чувствовать себя сильной и здоровой.",
    benefits: ["Укрепление мышц таза", "Улучшение осанки", "Повышение энергии", "Общее самочувствие"],
    trainer: "Анна Петрова",
    price: "от 700₽",
    emoji: "🌸",
    color: "from-pink-500 to-rose-500"
  },
  oriental_dance: {
    direction: "Восточные танцы",
    score: 0,
    title: "Восточная красавица 💃",
    description: "Восточные танцы - твоя страсть! Ты любишь грацию, пластику и женственность.",
    benefits: ["Развитие пластики", "Укрепление мышц", "Повышение уверенности", "Хорошее настроение"],
    trainer: "Елена Смирнова",
    price: "от 800₽",
    emoji: "💃",
    color: "from-purple-500 to-pink-500"
  },
  lady_dance: {
    direction: "Леди-денс",
    score: 0,
    title: "Современная леди 👑",
    description: "Леди-денс - твой стиль! Ты хочешь быть уверенной, сексуальной и женственной.",
    benefits: ["Развитие женственности", "Повышение уверенности", "Улучшение осанки", "Снятие стресса"],
    trainer: "Елена Смирнова",
    price: "от 900₽",
    emoji: "👑",
    color: "from-rose-500 to-pink-500"
  },
  street_lifting: {
    direction: "Стрит-лифтинг",
    score: 0,
    title: "Уличный атлет 💪",
    description: "Стрит-лифтинг - твой выбор! Ты хочешь развить функциональную силу с собственным весом.",
    benefits: ["Функциональная сила", "Развитие координации", "Улучшение баланса", "Повышение выносливости"],
    trainer: "Дмитрий Волков",
    price: "от 1000₽",
    emoji: "💪",
    color: "from-gray-500 to-slate-500"
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
    functional: 0,
    zumba: 0,
    taebo: 0,
    yoga_hatha: 0,
    joint_gymnastics: 0,
    women_health: 0,
    oriental_dance: 0,
    lady_dance: 0,
    street_lifting: 0
  })
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [topResults, setTopResults] = useState<QuizResult[]>([])
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
        // Показываем результаты - 1 групповое + 2 индивидуальных направления
        const allResults = Object.entries(newScores)
          .map(([key, score]) => ({ ...results[key], score, key }))
          .sort((a, b) => b.score - a.score)
        
        // Групповые направления (все кроме personal)
        const groupDirections = allResults.filter(result => result.key !== 'personal')
        // Индивидуальные направления (только personal)
        const individualDirections = allResults.filter(result => result.key === 'personal')
        
        // Выбираем 1 лучшее групповое и 2 лучших индивидуальных
        const selectedGroup = groupDirections.slice(0, 1)
        const selectedIndividual = individualDirections.slice(0, 2)
        
        // Объединяем результаты: сначала групповое, потом индивидуальные
        const sortedResults = [...selectedGroup, ...selectedIndividual]
        
        setTopResults(sortedResults)
        setResult(sortedResults[0]) // Основной результат
        setShowResult(true)
        setConfetti(true)
        onComplete(sortedResults[0])
        
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
      const newScores = { 
        yoga: 0, pilates: 0, crossfit: 0, personal: 0, group: 0, functional: 0,
        zumba: 0, taebo: 0, yoga_hatha: 0, joint_gymnastics: 0, women_health: 0,
        oriental_dance: 0, lady_dance: 0, street_lifting: 0
      }
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
    setScores({ 
      yoga: 0, pilates: 0, crossfit: 0, personal: 0, group: 0, functional: 0,
      zumba: 0, taebo: 0, yoga_hatha: 0, joint_gymnastics: 0, women_health: 0,
      oriental_dance: 0, lady_dance: 0, street_lifting: 0
    })
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
        className="relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl w-full max-w-xs sm:max-w-lg mx-auto"
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
          {/* Основной результат */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4"
          >
            <div className={`text-3xl sm:text-4xl mb-2 bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}>
              {result.emoji}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              {result.title}
            </h2>
            <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${result.color} text-white font-semibold text-sm mb-3`}>
              {result.direction}
            </div>
          </motion.div>

          {/* Дополнительные рекомендации - компактная версия */}
          {topResults.length > 1 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Также рекомендуем:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {topResults.slice(1).map((rec, index) => (
                  <div key={index} className={`px-3 py-2 rounded-lg text-xs font-medium ${
                    rec.key === 'personal' 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    <span className="mr-1">{rec.emoji}</span>
                    {rec.direction}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Описание и преимущества - компактная версия */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-4"
          >
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              {result.description}
            </p>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-700">
              {result.benefits.slice(0, 4).map((benefit, index) => (
                <div key={index} className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span className="truncate">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Информация о тренере - компактная версия */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-50 rounded-lg p-3 mb-4"
          >
            <div className="flex justify-between items-center text-sm">
              <div>
                <span className="text-gray-600">Тренер: </span>
                <span className="font-semibold text-gray-900">{result.trainer}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-orange-500">{result.price}</span>
              </div>
            </div>
          </motion.div>

          {/* Кнопки действий - компактная версия */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            {/* Основная кнопка */}
            <button
              onClick={() => onBooking(result.direction)}
              className={`w-full bg-gradient-to-r ${result.color} text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 text-sm`}
            >
              Записаться на {result.direction}
            </button>
            
            {/* Дополнительные кнопки */}
            {topResults.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {topResults.slice(1).map((rec, index) => (
                  <button
                    key={index}
                    onClick={() => onBooking(rec.direction)}
                    className={`px-3 py-2 rounded-lg font-medium text-xs transition-colors ${
                      rec.key === 'personal' 
                        ? 'bg-green-100 hover:bg-green-200 text-green-700' 
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                    }`}
                  >
                    {rec.direction}
                  </button>
                ))}
              </div>
            )}
            
            {/* Вспомогательные кнопки */}
            <div className="flex justify-center gap-2">
              <button
                onClick={shareResult}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Поделиться"
              >
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>
              
              <button
                onClick={restartQuiz}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Заново"
              >
                <RefreshCw className="w-4 h-4 text-gray-600" />
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
