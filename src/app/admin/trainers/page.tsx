'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Trainer {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  image: string;
  club_name: string;
  certifications: string[];
  bio: string;
  schedule: string[];
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await fetch('/api/trainers');
      const data = await response.json();
      setTrainers(data);
    } catch (error) {
      console.error('Error fetching trainers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого тренера?')) {
      return;
    }

    try {
      const response = await fetch(`/api/trainers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTrainers(trainers.filter(trainer => trainer.id !== id));
      } else {
        alert('Ошибка при удалении тренера');
      }
    } catch (error) {
      console.error('Error deleting trainer:', error);
      alert('Ошибка при удалении тренера');
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
          <h1 className="text-2xl font-bold text-gray-900">Тренеры</h1>
          <p className="mt-1 text-sm text-gray-500">
            Управление тренерами
          </p>
        </div>
        <Link
          href="/admin/trainers/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
        >
          Добавить тренера
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {trainers.map((trainer) => (
            <li key={trainer.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={trainer.image}
                      alt={trainer.name}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{trainer.name}</div>
                    <div className="text-sm text-gray-500">{trainer.specialty}</div>
                    <div className="text-sm text-gray-500">{trainer.experience}</div>
                    <div className="text-sm text-gray-500">{trainer.club_name}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/trainers/${trainer.id}/edit`}
                    className="text-orange-600 hover:text-orange-900 text-sm font-medium"
                  >
                    Редактировать
                  </Link>
                  <button
                    onClick={() => handleDelete(trainer.id)}
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
