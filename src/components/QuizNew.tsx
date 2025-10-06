'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  CheckCircle,
  Loader2
} from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  question_type: string;
  order_index: number;
  answers: Array<{
    id: number;
    answer_text: string;
    answer_value: string;
    order_index: number;
  }>;
}

interface QuizRecommendation {
  id: number;
  name: string;
  description: string;
  trainer_ids: string[];
  direction_ids: string[];
  club_ids: string[];
}

interface QuizResult {
  direction: string;
  title: string;
  description: string;
  benefits: string[];
  trainer: string;
  price: string;
  emoji: string;
  color: string;
}

interface FitnessQuizProps {
  onComplete: (result: QuizResult) => void;
  onBooking: (direction: string) => void;
}

export default function QuizNew({ onComplete, onBooking }: FitnessQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [recommendations, setRecommendations] = useState<QuizRecommendation[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/quiz/questions');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  const handleAnswer = (answerValue: string) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const question = questions[currentQuestion];
    
    // Обновляем ответы
    const newAnswers = { ...answers, [question.id.toString()]: answerValue };
    setAnswers(newAnswers);

    // Тактильная обратная связь
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        submitQuiz(newAnswers);
      }
      setIsAnimating(false);
    }, 300);
  };

  const submitQuiz = async (finalAnswers: Record<string, string>) => {
    setSubmitting(true);
    
    try {
      const sessionId = `quiz_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: finalAnswers,
          session_id: sessionId
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setRecommendations(result.recommendations);
        setShowResult(true);
        setConfetti(true);
        
        // Преобразуем рекомендации в формат результата
        if (result.recommendations.length > 0) {
          const mainRecommendation = result.recommendations[0];
          const quizResult: QuizResult = {
            direction: mainRecommendation.name,
            title: mainRecommendation.name,
            description: mainRecommendation.description,
            benefits: ["Персональный подход", "Профессиональные тренеры", "Современное оборудование", "Гибкий график"],
            trainer: "Наши тренеры",
            price: "Уточните цену",
            emoji: "💪",
            color: "from-orange-500 to-red-500"
          };
          onComplete(quizResult);
        }
      } else {
        alert('Ошибка при обработке результатов квиза');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Ошибка при отправке квиза');
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0 && !isAnimating) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setRecommendations([]);
    setConfetti(false);
  };

  const shareResult = () => {
    if (recommendations.length > 0 && navigator.share) {
      const mainRec = recommendations[0];
      navigator.share({
        title: `Мой результат квиза FitZone: ${mainRec.name}`,
        text: `Я прошел квиз и мне подходит ${mainRec.name}! ${mainRec.description}`,
        url: window.location.href
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl w-full max-w-sm sm:max-w-2xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  if (showResult && recommendations.length > 0) {
    const mainRecommendation = recommendations[0];
    
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
            <div className="text-3xl sm:text-4xl mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              💪
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              {mainRecommendation.name}
            </h2>
            <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm mb-3">
              Рекомендация
            </div>
          </motion.div>

          {/* Дополнительные рекомендации */}
          {recommendations.length > 1 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Также рекомендуем:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {recommendations.slice(1).map((rec, index) => (
                  <div key={index} className="px-3 py-2 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                    <span className="mr-1">💪</span>
                    {rec.name}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Описание */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-4"
          >
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              {mainRecommendation.description}
            </p>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-700">
              {["Персональный подход", "Профессиональные тренеры", "Современное оборудование", "Гибкий график"].map((benefit, index) => (
                <div key={index} className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span className="truncate">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Информация о тренере */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-50 rounded-lg p-3 mb-4"
          >
            <div className="flex justify-between items-center text-sm">
              <div>
                <span className="text-gray-600">Тренер: </span>
                <span className="font-semibold text-gray-900">Наши тренеры</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-orange-500">Уточните цену</span>
              </div>
            </div>
          </motion.div>

          {/* Кнопки действий */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <button
              onClick={() => onBooking(mainRecommendation.name)}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 text-sm"
            >
              Записаться на {mainRecommendation.name}
            </button>
            
            {recommendations.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {recommendations.slice(1).map((rec, index) => (
                  <button
                    key={index}
                    onClick={() => onBooking(rec.name)}
                    className="px-3 py-2 rounded-lg font-medium text-xs transition-colors bg-blue-100 hover:bg-blue-200 text-blue-700"
                  >
                    {rec.name}
                  </button>
                ))}
              </div>
            )}
            
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
    );
  }

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl w-full max-w-sm sm:max-w-2xl mx-auto">
        <div className="text-center">
          <p className="text-gray-500">Вопросы квиза не найдены</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

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
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💪</div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 px-2">
              {question.question}
            </h3>
          </div>

          {/* Варианты ответов */}
          <div className="grid gap-3 mb-6">
            {question.answers.map((answer, index) => (
              <motion.button
                key={answer.id}
                onClick={() => handleAnswer(answer.answer_value)}
                disabled={isAnimating || submitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group p-3 sm:p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 text-left disabled:opacity-50"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="font-medium text-sm sm:text-base text-gray-900 group-hover:text-orange-600 transition-colors">
                    {answer.answer_text}
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
          disabled={currentQuestion === 0 || isAnimating || submitting}
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

        <div className="w-16" />
      </div>

      {submitting && (
        <div className="mt-4 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-orange-500 mr-2" />
          <span className="text-sm text-gray-600">Обрабатываем результаты...</span>
        </div>
      )}
    </div>
  );
}
