'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Club {
  id: string;
  name: string;
}

export default function NewTrainerPage() {
  const [formData, setFormData] = useState({
    id: '',
    club_id: '',
    name: '',
    specialty: '',
    experience: '',
    image: '',
    certifications: [] as string[],
    bio: '',
    schedule: [] as string[]
  });
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const [certificationInput, setCertificationInput] = useState('');
  const [scheduleInput, setScheduleInput] = useState('');
  const router = useRouter();

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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/trainers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/trainers');
      } else {
        const error = await response.json();
        alert(error.error || 'Ошибка создания тренера');
      }
    } catch (error) {
      console.error('Error creating trainer:', error);
      alert('Ошибка создания тренера');
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

  const addCertification = () => {
    if (certificationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, certificationInput.trim()]
      }));
      setCertificationInput('');
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Добавить тренера</h1>
        <p className="mt-1 text-sm text-gray-500">
          Создание нового тренера
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                ID тренера
              </label>
              <input
                type="text"
                name="id"
                id="id"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.id}
                onChange={handleChange}
                placeholder="anna-pionerskaya"
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
                <option value="">Выберите клуб</option>
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Имя
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.name}
                onChange={handleChange}
                placeholder="Анна Петрова"
              />
            </div>

            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                Специализация
              </label>
              <input
                type="text"
                name="specialty"
                id="specialty"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="Йога и Пилатес"
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                Опыт работы
              </label>
              <input
                type="text"
                name="experience"
                id="experience"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.experience}
                onChange={handleChange}
                placeholder="8 лет опыта"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                URL фотографии
              </label>
              <input
                type="url"
                name="image"
                id="image"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Сертификации
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={certificationInput}
                  onChange={(e) => setCertificationInput(e.target.value)}
                  placeholder="RYT-500"
                />
                <button
                  type="button"
                  onClick={addCertification}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Добавить
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                  >
                    {cert}
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="ml-1 text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Биография
              </label>
              <textarea
                name="bio"
                id="bio"
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Краткая биография тренера..."
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
                  placeholder="Пн, Ср, Пт: 09:00-10:00"
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
            {loading ? 'Создание...' : 'Создать тренера'}
          </button>
        </div>
      </form>
    </div>
  );
}
