'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Club {
  id: string;
  name: string;
  address: string;
  phone: string;
  description: string;
  trainers: unknown[];
  directions: unknown[];
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await fetch('/api/clubs');
      const data = await response.json();
      setClubs(data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот клуб?')) {
      return;
    }

    try {
      const response = await fetch(`/api/clubs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClubs(clubs.filter(club => club.id !== id));
      } else {
        alert('Ошибка при удалении клуба');
      }
    } catch (error) {
      console.error('Error deleting club:', error);
      alert('Ошибка при удалении клуба');
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
          <h1 className="text-2xl font-bold text-gray-900">Клубы</h1>
          <p className="mt-1 text-sm text-gray-500">
            Управление фитнес-клубами
          </p>
        </div>
        <Link
          href="/admin/clubs/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
        >
          Добавить клуб
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {clubs.map((club) => (
            <li key={club.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{club.name}</div>
                    <div className="text-sm text-gray-500">{club.address}</div>
                    <div className="text-sm text-gray-500">{club.phone}</div>
                    <div className="text-sm text-gray-500">
                      {club.trainers.length} тренеров, {club.directions.length} направлений
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/clubs/${club.id}/edit`}
                    className="text-orange-600 hover:text-orange-900 text-sm font-medium"
                  >
                    Редактировать
                  </Link>
                  <button
                    onClick={() => handleDelete(club.id)}
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
