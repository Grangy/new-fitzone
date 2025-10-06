'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';

export default function NewClubPage() {
  const [formData, setFormData] = useState({
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
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/clubs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          photos: photos
        }),
      });

      if (response.ok) {
        router.push('/admin/clubs');
      } else {
        const error = await response.json();
        alert(error.error || 'Ошибка создания клуба');
      }
    } catch (error) {
      console.error('Error creating club:', error);
      alert('Ошибка создания клуба');
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Добавить клуб</h1>
        <p className="mt-1 text-sm text-gray-500">
          Создание нового фитнес-клуба
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                ID клуба
              </label>
              <input
                type="text"
                name="id"
                id="id"
                required
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={formData.id}
                onChange={handleChange}
                placeholder="pionerskaya"
              />
            </div>

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
                placeholder="ул. Пионерская"
              />
            </div>

            <div className="sm:col-span-2">
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
                placeholder="ул. Пионерская, 15"
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
                placeholder="+7 (8617) 123-45-67"
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
                placeholder="https://wa.me/786171234567"
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
                placeholder="https://t.me/fitzone_pionerskaya"
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
                placeholder="https://vk.com/fitzone_pionerskaya"
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
                placeholder="https://instagram.com/fitzone_pionerskaya"
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
                placeholder="Современный фитнес-клуб в центре города с полным спектром услуг"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Фотографии клуба</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <ImageUpload
                  value={photo}
                  onChange={(url) => {
                    const newPhotos = [...photos];
                    newPhotos[index] = url;
                    setPhotos(newPhotos);
                  }}
                  onRemove={() => {
                    const newPhotos = photos.filter((_, i) => i !== index);
                    setPhotos(newPhotos);
                  }}
                  type="club"
                  className="w-full h-48"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setPhotos([...photos, ''])}
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors flex flex-col items-center justify-center"
            >
              <span className="text-gray-500 text-lg">+</span>
              <span className="text-gray-500 text-sm mt-2">Добавить фотографию</span>
            </button>
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
            {loading ? 'Создание...' : 'Создать клуб'}
          </button>
        </div>
      </form>
    </div>
  );
}
