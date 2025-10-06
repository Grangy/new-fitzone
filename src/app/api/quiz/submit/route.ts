import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

interface QuizCondition {
  question_id: string;
  answer_values: string[];
  operator?: 'in' | 'not_in' | 'equals';
}

interface QuizRecommendation {
  id: number;
  name: string;
  description: string;
  conditions: string;
  trainer_ids: string;
  direction_ids: string;
  club_ids: string;
  priority: number;
}

interface MatchingRecommendation {
  id: number;
  name: string;
  description: string;
  trainer_ids: string[];
  direction_ids: string[];
  club_ids: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { answers, session_id }: { answers: Record<string, string>; session_id: string } = await request.json();

    if (!answers || !session_id) {
      return NextResponse.json({ error: 'Answers and session_id are required' }, { status: 400 });
    }

    // Получаем все рекомендации
    const recommendations = await database.all(`
      SELECT * FROM quiz_recommendations 
      WHERE is_active = 1 
      ORDER BY priority DESC
    `) as QuizRecommendation[];

    // Находим подходящие рекомендации
    const matchingRecommendations: MatchingRecommendation[] = [];
    
    for (const rec of recommendations) {
      const conditions: QuizCondition[] = JSON.parse(rec.conditions);
      let matches = true;

      // Проверяем каждое условие
      for (const condition of conditions) {
        const { question_id, answer_values, operator = 'in' } = condition;
        const userAnswer = answers[question_id];

        if (!userAnswer) {
          matches = false;
          break;
        }

        let conditionMet = false;
        
        if (operator === 'in') {
          conditionMet = answer_values.includes(userAnswer);
        } else if (operator === 'not_in') {
          conditionMet = !answer_values.includes(userAnswer);
        } else if (operator === 'equals') {
          conditionMet = answer_values.includes(userAnswer);
        }

        if (!conditionMet) {
          matches = false;
          break;
        }
      }

      if (matches) {
        matchingRecommendations.push({
          id: rec.id,
          name: rec.name,
          description: rec.description,
          trainer_ids: JSON.parse(rec.trainer_ids || '[]'),
          direction_ids: JSON.parse(rec.direction_ids || '[]'),
          club_ids: JSON.parse(rec.club_ids || '[]')
        });
      }
    }

    // Сохраняем результат
    await database.run(
      'INSERT INTO quiz_results (session_id, answers, recommendations) VALUES (?, ?, ?)',
      [session_id, JSON.stringify(answers), JSON.stringify(matchingRecommendations)]
    );

    return NextResponse.json({
      success: true,
      recommendations: matchingRecommendations
    });

  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json({ error: 'Failed to submit quiz' }, { status: 500 });
  }
}
