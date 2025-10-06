'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Direction {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  duration: string;
  level: string;
  club_name: string;
  schedule: string[];
  trainer: string;
}

export default function DirectionsPage() {
  const [directions, setDirections] = useState<Direction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDirections();
  }, []);

  const fetchDirections = async () => {
    try {
      const response = await fetch('/api/directions');
      const data = await response.json();
      setDirections(data);
    } catch (error) {
      console.error('Error fetching directions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить это направление?')) {
      return;
    }

    try {
      const response = await fetch(`/api/directions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDirections(directions.filter(direction => direction.id !== id));
      } else {
        alert('Ошибка при удалении направления');
      }
    } catch (error) {
      console.error('Error deleting direction:', error);
      alert('Ошибка при удалении направления');
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
          <h1 className="text-2xl font-bold text-gray-900">Направления</h1>
          <p className="mt-1 text-sm text-gray-500">
            Управление направлениями тренировок
          </p>
        </div>
        <Link
          href="/admin/directions/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
        >
          Добавить направление
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {directions.map((direction) => (
            <li key={direction.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={direction.image}
                      alt={direction.title}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{direction.title}</div>
                    <div className="text-sm text-gray-500">{direction.description}</div>
                    <div className="text-sm text-gray-500">
                      {direction.price} • {direction.duration} • {direction.level}
                    </div>
                    <div className="text-sm text-gray-500">{direction.club_name}</div>
                    <div className="text-sm text-gray-500">Тренер: {direction.trainer}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/directions/${direction.id}/edit`}
                    className="text-orange-600 hover:text-orange-900 text-sm font-medium"
                  >
                    Редактировать
                  </Link>
                  <button
                    onClick={() => handleDelete(direction.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
