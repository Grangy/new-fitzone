import { database } from '../lib/database';

const questions = [
  {
    question: "Какая у тебя основная цель?",
    question_type: "single",
    order_index: 1,
    answers: [
      { answer_text: "Расслабление и гибкость", answer_value: "relaxation" },
      { answer_text: "Похудение и тонус", answer_value: "weight_loss" },
      { answer_text: "Сила и выносливость", answer_value: "strength" },
      { answer_text: "Индивидуальный подход", answer_value: "personal" }
    ]
  },
  {
    question: "Сколько времени готов уделять тренировкам?",
    question_type: "single",
    order_index: 2,
    answers: [
      { answer_text: "30-45 минут", answer_value: "short" },
      { answer_text: "60 минут", answer_value: "medium" },
      { answer_text: "90+ минут", answer_value: "long" }
    ]
  },
  {
    question: "Какая атмосфера тебе ближе?",
    question_type: "single",
    order_index: 3,
    answers: [
      { answer_text: "Спокойная и медитативная", answer_value: "calm" },
      { answer_text: "Энергичная и мотивирующая", answer_value: "energetic" },
      { answer_text: "Индивидуальная и сосредоточенная", answer_value: "focused" },
      { answer_text: "Командная и поддерживающая", answer_value: "team" }
    ]
  },
  {
    question: "Твой уровень физической подготовки?",
    question_type: "single",
    order_index: 4,
    answers: [
      { answer_text: "Новичок", answer_value: "beginner" },
      { answer_text: "Средний", answer_value: "intermediate" },
      { answer_text: "Продвинутый", answer_value: "advanced" }
    ]
  },
  {
    question: "Что важнее всего в тренировке?",
    question_type: "single",
    order_index: 5,
    answers: [
      { answer_text: "Техника и правильность", answer_value: "technique" },
      { answer_text: "Интенсивность и результат", answer_value: "intensity" },
      { answer_text: "Разнообразие упражнений", answer_value: "variety" }
    ]
  }
];

const recommendations = [
  {
    name: "Йога для начинающих",
    description: "Идеально подходит для тех, кто ищет баланс между телом и духом. Спокойная атмосфера и работа с гибкостью.",
    conditions: [
      { question_id: "1", answer_values: ["relaxation"], operator: "in" },
      { question_id: "3", answer_values: ["calm"], operator: "in" },
      { question_id: "4", answer_values: ["beginner", "intermediate"], operator: "in" }
    ],
    trainer_ids: [],
    direction_ids: ["yoga"],
    club_ids: [],
    priority: 1
  },
  {
    name: "Пилатес для тонуса",
    description: "Отлично подходит для укрепления мышц кора и улучшения осанки. Контролируемые движения и внимание к технике.",
    conditions: [
      { question_id: "1", answer_values: ["weight_loss"], operator: "in" },
      { question_id: "2", answer_values: ["short", "medium"], operator: "in" },
      { question_id: "5", answer_values: ["technique"], operator: "in" }
    ],
    trainer_ids: [],
    direction_ids: ["pilates"],
    club_ids: [],
    priority: 1
  },
  {
    name: "Кроссфит для силы",
    description: "Интенсивные тренировки для развития силы и выносливости. Энергичная атмосфера и быстрые результаты.",
    conditions: [
      { question_id: "1", answer_values: ["strength"], operator: "in" },
      { question_id: "2", answer_values: ["long"], operator: "in" },
      { question_id: "3", answer_values: ["energetic"], operator: "in" },
      { question_id: "4", answer_values: ["advanced"], operator: "in" }
    ],
    trainer_ids: [],
    direction_ids: ["crossfit"],
    club_ids: [],
    priority: 1
  },
  {
    name: "Персональные тренировки",
    description: "Индивидуальный подход с максимальным вниманием тренера. Гибкий график и персональная программа.",
    conditions: [
      { question_id: "1", answer_values: ["personal"], operator: "in" },
      { question_id: "3", answer_values: ["focused"], operator: "in" }
    ],
    trainer_ids: [],
    direction_ids: ["personal"],
    club_ids: [],
    priority: 2
  },
  {
    name: "Групповые программы",
    description: "Энергичные групповые тренировки с мотивацией команды. Разнообразие программ и доступная цена.",
    conditions: [
      { question_id: "3", answer_values: ["team", "energetic"], operator: "in" },
      { question_id: "5", answer_values: ["variety"], operator: "in" }
    ],
    trainer_ids: [],
    direction_ids: ["group"],
    club_ids: [],
    priority: 1
  },
  {
    name: "Функциональный тренинг",
    description: "Развитие функциональной силы для повседневной жизни. Улучшение координации и баланса.",
    conditions: [
      { question_id: "1", answer_values: ["strength"], operator: "in" },
      { question_id: "4", answer_values: ["intermediate", "advanced"], operator: "in" },
      { question_id: "5", answer_values: ["technique", "variety"], operator: "in" }
    ],
    trainer_ids: [],
    direction_ids: ["functional"],
    club_ids: [],
    priority: 1
  }
];

export async function migrateQuizData() {
  try {
    console.log('Начинаем миграцию данных квиза...');

    // Очищаем существующие данные
    await database.run('DELETE FROM quiz_answers');
    await database.run('DELETE FROM quiz_questions');
    await database.run('DELETE FROM quiz_recommendations');

    // Добавляем вопросы
    for (const questionData of questions) {
      const result = await database.run(
        'INSERT INTO quiz_questions (question, question_type, order_index) VALUES (?, ?, ?)',
        [questionData.question, questionData.question_type, questionData.order_index]
      );

      const questionId = result.lastID;

      // Добавляем ответы
      for (let i = 0; i < questionData.answers.length; i++) {
        const answer = questionData.answers[i];
        await database.run(
          'INSERT INTO quiz_answers (question_id, answer_text, answer_value, order_index) VALUES (?, ?, ?, ?)',
          [questionId, answer.answer_text, answer.answer_value, i]
        );
      }
    }

    // Добавляем рекомендации
    for (const recData of recommendations) {
      await database.run(
        `INSERT INTO quiz_recommendations 
         (name, description, conditions, trainer_ids, direction_ids, club_ids, priority) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          recData.name,
          recData.description,
          JSON.stringify(recData.conditions),
          JSON.stringify(recData.trainer_ids),
          JSON.stringify(recData.direction_ids),
          JSON.stringify(recData.club_ids),
          recData.priority
        ]
      );
    }

    console.log('Миграция данных квиза завершена успешно!');
  } catch (error) {
    console.error('Ошибка при миграции данных квиза:', error);
    throw error;
  }
}

// Запуск миграции если файл выполняется напрямую
if (require.main === module) {
  migrateQuizData()
    .then(() => {
      console.log('Миграция завершена');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Ошибка миграции:', error);
      process.exit(1);
    });
}
