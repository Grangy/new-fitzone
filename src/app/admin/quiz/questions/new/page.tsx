'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';

export default function NewQuestionPage() {
  const [formData, setFormData] = useState({
    question: '',
    question_type: 'single',
    order_index: 1,
    answers: [
      { answer_text: '', answer_value: '', order_index: 0 }
    ]
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/quiz/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/quiz');
      } else {
        const error = await response.json();
        alert(error.error || 'Ошибка создания вопроса');
      }
    } catch (error) {
      console.error('Error creating question:', error);
      alert('Ошибка создания вопроса');
    } finally {
      setLoading(false);
    }
  };

  const addAnswer = () => {
    setFormData(prev => ({
      ...prev,
      answers: [...prev.answers, { answer_text: '', answer_value: '', order_index: prev.answers.length }]
    }));
  };

  const removeAnswer = (index: number) => {
    if (formData.answers.length > 1) {
      setFormData(prev => ({
        ...prev,
        answers: prev.answers.filter((_, i) => i !== index).map((answer, i) => ({
          ...answer,
          order_index: i
        }))
      }));
    }
  };

  const updateAnswer = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.map((answer, i) => 
        i === index ? { ...answer, [field]: value } : answer
      )
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Добавить вопрос</h1>
        <p className="mt-1 text-sm text-gray-500">
          Создание нового вопроса для фитнес-квиза
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                Вопрос
              </label>
              <textarea
                id="question"
                name="question"
                rows={3}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Введите текст вопроса"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="question_type" className="block text-sm font-medium text-gray-700">
                  Тип вопроса
                </label>
                <select
                  id="question_type"
                  name="question_type"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={formData.question_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, question_type: e.target.value }))}
                >
                  <option value="single">Одиночный выбор</option>
                  <option value="multiple">Множественный выбор</option>
                </select>
              </div>

              <div>
                <label htmlFor="order_index" className="block text-sm font-medium text-gray-700">
                  Порядок
                </label>
                <input
                  type="number"
                  id="order_index"
                  name="order_index"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={formData.order_index}
                  onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Ответы
              </label>
              <div className="space-y-4">
                {formData.answers.map((answer, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Текст ответа"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        value={answer.answer_text}
                        onChange={(e) => updateAnswer(index, 'answer_text', e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Значение ответа"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        value={answer.answer_value}
                        onChange={(e) => updateAnswer(index, 'answer_value', e.target.value)}
                        required
                      />
                    </div>
                    {formData.answers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAnswer(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAnswer}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить ответ
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
          >
            {loading ? 'Создание...' : 'Создать вопрос'}
          </button>
        </div>
      </form>
    </div>
  );
}
