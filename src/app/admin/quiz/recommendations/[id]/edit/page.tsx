'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Club {
  id: string;
  name: string;
}

interface Trainer {
  id: string;
  name: string;
  specialty: string;
}

interface Direction {
  id: string;
  title: string;
}

interface Recommendation {
  id: number;
  name: string;
  description: string;
  conditions: Array<{
    question_id: string;
    answer_values: string[];
    operator: string;
  }>;
  trainer_ids: string[];
  direction_ids: string[];
  club_ids: string[];
  priority: number;
}

export default function EditRecommendationPage({ params }: { params: Promise<{ id: string }> }) {
  const [formData, setFormData] = useState<Recommendation>({
    id: 0,
    name: '',
    description: '',
    conditions: [
      { question_id: '', answer_values: [], operator: 'in' }
    ],
    trainer_ids: [],
    direction_ids: [],
    club_ids: [],
    priority: 1
  });
  const [clubs, setClubs] = useState<Club[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [directions, setDirections] = useState<Direction[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { id } = await params;
      
      const [clubsRes, trainersRes, directionsRes, questionsRes, recommendationRes] = await Promise.all([
        fetch('/api/clubs'),
        fetch('/api/trainers'),
        fetch('/api/directions'),
        fetch('/api/quiz/questions'),
        fetch(`/api/quiz/recommendations/${id}`)
      ]);

      const [clubsData, trainersData, directionsData, questionsData, recommendationData] = await Promise.all([
        clubsRes.json(),
        trainersRes.json(),
        directionsRes.json(),
        questionsRes.json(),
        recommendationRes.json()
      ]);

      setClubs(clubsData);
      setTrainers(trainersData);
      setDirections(directionsData);
      setQuestions(questionsData);
      setFormData(recommendationData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Ошибка загрузки данных');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { id } = await params;
      const response = await fetch(`/api/quiz/recommendations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/quiz/recommendations');
      } else {
        const error = await response.json();
        alert(error.error || 'Ошибка обновления рекомендации');
      }
    } catch (error) {
      console.error('Error updating recommendation:', error);
      alert('Ошибка обновления рекомендации');
    } finally {
      setLoading(false);
    }
  };

  const addCondition = () => {
    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, { question_id: '', answer_values: [], operator: 'in' }]
    }));
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const updateCondition = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) => 
        i === index ? { ...condition, [field]: value } : condition
      )
    }));
  };

  const addAnswerValue = (conditionIndex: number, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        conditions: prev.conditions.map((condition, i) => 
          i === conditionIndex 
            ? { ...condition, answer_values: [...condition.answer_values, value.trim()] }
            : condition
        )
      }));
    }
  };

  const removeAnswerValue = (conditionIndex: number, valueIndex: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) => 
        i === conditionIndex 
          ? { ...condition, answer_values: condition.answer_values.filter((_, vi) => vi !== valueIndex) }
          : condition
      )
    }));
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Редактировать рекомендацию</h1>
        <p className="mt-1 text-sm text-gray-500">
          Редактирование рекомендации квиза
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Название рекомендации
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Йога для начинающих"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Описание
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Идеально подходит для тех, кто ищет баланс между телом и духом..."
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Приоритет
                </label>
                <input
                  type="number"
                  id="priority"
                  name="priority"
                  min="1"
                  max="10"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Условия рекомендации</h3>
          <div className="space-y-4">
            {formData.conditions.map((condition, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Вопрос
                    </label>
                    <select
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      value={condition.question_id}
                      onChange={(e) => updateCondition(index, 'question_id', e.target.value)}
                    >
                      <option value="">Выберите вопрос</option>
                      {questions.map((q) => (
                        <option key={q.id} value={q.id}>
                          {q.question}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Оператор
                    </label>
                    <select
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      value={condition.operator}
                      onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                    >
                      <option value="in">Содержит</option>
                      <option value="not_in">Не содержит</option>
                      <option value="equals">Равно</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeCondition(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Удалить
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Значения ответов
                  </label>
                  <div className="space-y-2">
                    {condition.answer_values.map((value, valueIndex) => (
                      <div key={valueIndex} className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">{value}</span>
                        <button
                          type="button"
                          onClick={() => removeAnswerValue(index, valueIndex)}
                          className="text-red-600 hover:text-red-900"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Добавить значение"
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addAnswerValue(index, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addAnswerValue(index, input.value);
                          input.value = '';
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Добавить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addCondition}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors"
            >
              <span className="text-gray-500">+ Добавить условие</span>
            </button>
          </div>
        </div>

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Привязки</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тренеры
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {trainers.map((trainer) => (
                  <label key={trainer.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      checked={formData.trainer_ids.includes(trainer.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            trainer_ids: [...prev.trainer_ids, trainer.id]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            trainer_ids: prev.trainer_ids.filter(id => id !== trainer.id)
                          }));
                        }
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-700">{trainer.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Направления
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {directions.map((direction) => (
                  <label key={direction.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      checked={formData.direction_ids.includes(direction.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            direction_ids: [...prev.direction_ids, direction.id]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            direction_ids: prev.direction_ids.filter(id => id !== direction.id)
                          }));
                        }
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-700">{direction.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Клубы
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {clubs.map((club) => (
                  <label key={club.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      checked={formData.club_ids.includes(club.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            club_ids: [...prev.club_ids, club.id]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            club_ids: prev.club_ids.filter(id => id !== club.id)
                          }));
                        }
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-700">{club.name}</span>
                  </label>
                ))}
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
            {loading ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  );
}
