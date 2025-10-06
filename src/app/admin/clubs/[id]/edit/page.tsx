'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';

interface Club {
  id: string;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  telegram: string;
  vk: string;
  instagram: string;
  description: string;
  photos: string[];
}

export default function EditClubPage({ params }: { params: Promise<{ id: string }> }) {
  const [formData, setFormData] = useState<Club>({
    id: '',
    name: '',
    address: '',
    phone: '',
    whatsapp: '',
    telegram: '',
    vk: '',
    instagram: '',
    description: '',
    photos: []
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [photoInput, setPhotoInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchClub();
  }, []);

  const fetchClub = async () => {
    try {
      const { id } = await params;
      const response = await fetch(`/api/clubs/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      } else {
        alert('Клуб не найден');
        router.push('/admin/clubs');
      }
    } catch (error) {
      console.error('Error fetching club:', error);
      alert('Ошибка загрузки клуба');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { id } = await params;
      const response = await fetch(`/api/clubs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/clubs');
      } else {
        const error = await response.json();
        alert(error.error || 'Ошибка обновления клуба');
      }
    } catch (error) {
      console.error('Error updating club:', error);
      alert('Ошибка обновления клуба');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addPhoto = () => {
    if (photoInput.trim()) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, photoInput.trim()]
      }));
      setPhotoInput('');
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
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
        <h1 className="text-2xl font-bold text-gray-900">Редактировать клуб</h1>
        <p className="mt-1 text-sm text-gray-500">
          Редактирование информации о клубе
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Название
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Адрес
              </label>
              <input
                type="text"
                name="address"
                id="address"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Телефон
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
                WhatsApp
              </label>
              <input
                type="url"
                name="whatsapp"
                id="whatsapp"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.whatsapp}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="telegram" className="block text-sm font-medium text-gray-700">
                Telegram
              </label>
              <input
                type="url"
                name="telegram"
                id="telegram"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.telegram}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="vk" className="block text-sm font-medium text-gray-700">
                VK
              </label>
              <input
                type="url"
                name="vk"
                id="vk"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.vk}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                Instagram
              </label>
              <input
                type="url"
                name="instagram"
                id="instagram"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.instagram}
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
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Фотографии
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <ImageUpload
                      value={photo}
                      onChange={(url) => {
                        const newPhotos = [...formData.photos];
                        newPhotos[index] = url;
                        setFormData(prev => ({ ...prev, photos: newPhotos }));
                      }}
                      onRemove={() => removePhoto(index)}
                      type="club"
                      className="w-full h-48"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      photos: [...prev.photos, '']
                    }));
                  }}
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors flex flex-col items-center justify-center"
                >
                  <span className="text-gray-500 text-lg">+</span>
                  <span className="text-gray-500 text-sm mt-2">Добавить фотографию</span>
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
            {loading ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </form>
    </div>
  );
}
