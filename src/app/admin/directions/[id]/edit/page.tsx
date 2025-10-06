'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Club {
  id: string;
  name: string;
}

interface Direction {
  id: string;
  club_id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  duration: string;
  level: string;
  schedule: string[];
  trainer: string;
}

export default function EditDirectionPage({ params }: { params: Promise<{ id: string }> }) {
  const [formData, setFormData] = useState<Direction>({
    id: '',
    club_id: '',
    title: '',
    description: '',
    image: '',
    price: '',
    duration: '',
    level: '',
    schedule: [],
    trainer: ''
  });
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [scheduleInput, setScheduleInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchDirection();
    fetchClubs();
  }, []);

  const fetchDirection = async () => {
    try {
      const { id } = await params;
      const response = await fetch(`/api/directions/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      } else {
        alert('Направление не найдено');
        router.push('/admin/directions');
      }
    } catch (error) {
      console.error('Error fetching direction:', error);
      alert('Ошибка загрузки направления');
    } finally {
      setFetching(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const response = await fetch('/api/clubs');
      const data = await response.json();
      setClubs(data);
    } catch (error) {
      console.error('Error fetching clubs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { id } = await params;
      const response = await fetch(`/api/directions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/directions');
      } else {
        const error = await response.json();
        alert(error.error || 'Ошибка обновления направления');
      }
    } catch (error) {
      console.error('Error updating direction:', error);
      alert('Ошибка обновления направления');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSchedule = () => {
    if (scheduleInput.trim()) {
      setFormData(prev => ({
        ...prev,
        schedule: [...prev.schedule, scheduleInput.trim()]
      }));
      setScheduleInput('');
    }
  };

  const removeSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
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
        <h1 className="text-2xl font-bold text-gray-900">Редактировать направление</h1>
        <p className="mt-1 text-sm text-gray-500">
          Редактирование информации о направлении
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Название
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="club_id" className="block text-sm font-medium text-gray-700">
                Клуб
              </label>
              <select
                name="club_id"
                id="club_id"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.club_id}
                onChange={handleChange}
              >
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Цена
              </label>
              <input
                type="text"
                name="price"
                id="price"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Продолжительность
              </label>
              <input
                type="text"
                name="duration"
                id="duration"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                Уровень
              </label>
              <select
                name="level"
                id="level"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.level}
                onChange={handleChange}
              >
                <option value="Начинающий">Начинающий</option>
                <option value="Средний">Средний</option>
                <option value="Продвинутый">Продвинутый</option>
                <option value="Для всех уровней">Для всех уровней</option>
              </select>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                URL изображения
              </label>
              <input
                type="url"
                name="image"
                id="image"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.image}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="trainer" className="block text-sm font-medium text-gray-700">
                Тренер
              </label>
              <input
                type="text"
                name="trainer"
                id="trainer"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.trainer}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Описание
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Расписание
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={scheduleInput}
                  onChange={(e) => setScheduleInput(e.target.value)}
                  placeholder="Пн, Ср, Пт: 09:00"
                />
                <button
                  type="button"
                  onClick={addSchedule}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Добавить
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.schedule.map((sched, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {sched}
                    <button
                      type="button"
                      onClick={() => removeSchedule(index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
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
