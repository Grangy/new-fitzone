import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const question = await database.get(`
      SELECT q.*, 
             GROUP_CONCAT(
               json_object('id', a.id, 'answer_text', a.answer_text, 'answer_value', a.answer_value, 'order_index', a.order_index)
             ) as answers
      FROM quiz_questions q
      LEFT JOIN quiz_answers a ON q.id = a.question_id AND a.is_active = 1
      WHERE q.id = ? AND q.is_active = 1
      GROUP BY q.id
    `, [id]);

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const q = question as { answers: string };
    const formattedQuestion = {
      ...question,
      answers: q.answers ? JSON.parse(`[${q.answers}]`) : []
    };

    return NextResponse.json(formattedQuestion);
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json({ error: 'Failed to fetch question' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { question, question_type, order_index, answers = [] } = await request.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // Обновляем вопрос
    await database.run(
      'UPDATE quiz_questions SET question = ?, question_type = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [question, question_type, order_index, id]
    );

    // Удаляем старые ответы
    await database.run('DELETE FROM quiz_answers WHERE question_id = ?', [id]);

    // Добавляем новые ответы
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      await database.run(
        'INSERT INTO quiz_answers (question_id, answer_text, answer_value, order_index) VALUES (?, ?, ?, ?)',
        [id, answer.answer_text, answer.answer_value, i]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Мягкое удаление - помечаем как неактивный
    await database.run(
      'UPDATE quiz_questions SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    // Также помечаем ответы как неактивные
    await database.run(
      'UPDATE quiz_answers SET is_active = 0 WHERE question_id = ?',
      [id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}
