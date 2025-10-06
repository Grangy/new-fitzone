import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function GET() {
  try {
    const questions = await database.all(`
      SELECT q.*, 
             GROUP_CONCAT(
               json_object('id', a.id, 'answer_text', a.answer_text, 'answer_value', a.answer_value, 'order_index', a.order_index)
             ) as answers
      FROM quiz_questions q
      LEFT JOIN quiz_answers a ON q.id = a.question_id AND a.is_active = 1
      WHERE q.is_active = 1
      GROUP BY q.id
      ORDER BY q.order_index
    `);

    // Парсим JSON для answers
    const formattedQuestions = questions.map((q: { answers: string }) => ({
      ...q,
      answers: q.answers ? JSON.parse(`[${q.answers}]`) : []
    }));

    return NextResponse.json(formattedQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { question, question_type = 'single', order_index, answers = [] } = await request.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Создаем вопрос
    const result = await database.run(
      'INSERT INTO quiz_questions (question, question_type, order_index) VALUES (?, ?, ?)',
      [question, question_type, order_index]
    );

    const questionId = result.lastID;

    // Добавляем ответы
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      await database.run(
        'INSERT INTO quiz_answers (question_id, answer_text, answer_value, order_index) VALUES (?, ?, ?, ?)',
        [questionId, answer.answer_text, answer.answer_value, i]
      );
    }

    return NextResponse.json({ id: questionId, success: true });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}
