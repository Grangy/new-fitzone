'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Recommendation {
  id: number;
  name: string;
  description: string;
  conditions: any[];
  trainer_ids: string[];
  direction_ids: string[];
  club_ids: string[];
  priority: number;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/quiz/recommendations');
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту рекомендацию?')) return;

    try {
      const response = await fetch(`/api/quiz/recommendations/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRecommendations(recommendations.filter(r => r.id !== id));
      } else {
        alert('Ошибка удаления рекомендации');
      }
    } catch (error) {
      console.error('Error deleting recommendation:', error);
      alert('Ошибка удаления рекомендации');
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
          <h1 className="text-2xl font-bold text-gray-900">Рекомендации квиза</h1>
          <p className="mt-1 text-sm text-gray-500">
            Настройка рекомендаций на основе ответов пользователей
          </p>
        </div>
        <Link
          href="/admin/quiz/recommendations/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить рекомендацию
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {recommendations.map((recommendation) => (
            <li key={recommendation.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-3">
                      Приоритет: {recommendation.priority}
                    </span>
                    <h3 className="text-sm font-medium text-gray-900">
                      {recommendation.name}
                    </h3>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {recommendation.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {recommendation.trainer_ids.length > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Тренеры: {recommendation.trainer_ids.length}
                        </span>
                      )}
                      {recommendation.direction_ids.length > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Направления: {recommendation.direction_ids.length}
                        </span>
                      )}
                      {recommendation.club_ids.length > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Клубы: {recommendation.club_ids.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/quiz/recommendations/${recommendation.id}/edit`}
                    className="text-orange-600 hover:text-orange-900"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(recommendation.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {recommendations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Рекомендации не найдены</p>
            <Link
              href="/admin/quiz/recommendations/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить первую рекомендацию
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
