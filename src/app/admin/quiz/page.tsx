'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, RefreshCw } from 'lucide-react';

interface Question {
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

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот вопрос?')) return;

    try {
      const response = await fetch(`/api/quiz/questions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setQuestions(questions.filter(q => q.id !== id));
      } else {
        alert('Ошибка удаления вопроса');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Ошибка удаления вопроса');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление квизом</h1>
          <p className="mt-1 text-sm text-gray-500">
            Настройка вопросов и рекомендаций для фитнес-квиза
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/quiz/questions/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить вопрос
          </Link>
          <Link
            href="/admin/quiz/recommendations"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            Рекомендации
          </Link>
          <button
            onClick={async () => {
              if (confirm('Загрузить начальные данные квиза? Это перезапишет существующие данные.')) {
                try {
                  const response = await fetch('/api/quiz/migrate', { method: 'POST' });
                  if (response.ok) {
                    alert('Данные квиза успешно загружены!');
                    window.location.reload();
                  } else {
                    alert('Ошибка загрузки данных');
                  }
                } catch (error) {
                  alert('Ошибка загрузки данных');
                }
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Загрузить данные
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {questions.map((question) => (
            <li key={question.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mr-3">
                      #{question.order_index}
                    </span>
                    <h3 className="text-sm font-medium text-gray-900">
                      {question.question}
                    </h3>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Тип: {question.question_type === 'single' ? 'Одиночный выбор' : 'Множественный выбор'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Ответов: {question.answers.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/quiz/questions/${question.id}/edit`}
                    className="text-orange-600 hover:text-orange-900"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {questions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Вопросы не найдены</p>
            <Link
              href="/admin/quiz/questions/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить первый вопрос
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
