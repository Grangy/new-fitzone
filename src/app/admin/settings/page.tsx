'use client';

import { useEffect, useState } from 'react';

interface SiteConfig {
  site: {
    name: string;
    title: string;
    description: string;
    keywords: string;
    url: string;
    locale: string;
    author: string;
    creator: string;
    publisher: string;
  };
  contacts: {
    phone: string;
    email: string;
    address: string;
    workingHours: string;
  };
  social: {
    instagram: string;
    vk: string;
    telegram: string;
    whatsapp: string;
  };
  settings: {
    themeColor: string;
    defaultClub: string;
    autoPlayVideo: boolean;
    showPromoBanner: boolean;
    enableQuiz: boolean;
  };
}

export default function SettingsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/site-config');
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/site-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        alert('Настройки сохранены успешно!');
      } else {
        alert('Ошибка при сохранении настроек');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (section: string, field: string, value: unknown) => {
    if (!config) return;
    
    setConfig({
      ...config,
      [section]: {
        ...config[section as keyof SiteConfig],
        [field]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!config) {
    return <div>Ошибка загрузки конфигурации</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Настройки сайта</h1>
        <p className="mt-1 text-sm text-gray-500">
          Управление общей конфигурацией сайта
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Основная информация */}
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Основная информация
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="site-name" className="block text-sm font-medium text-gray-700">
                Название сайта
              </label>
              <input
                type="text"
                id="site-name"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={config.site.name}
                onChange={(e) => handleChange('site', 'name', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="site-title" className="block text-sm font-medium text-gray-700">
                Заголовок
              </label>
              <input
                type="text"
                id="site-title"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={config.site.title}
                onChange={(e) => handleChange('site', 'title', e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="site-description" className="block text-sm font-medium text-gray-700">
                Описание
              </label>
              <textarea
                id="site-description"
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={config.site.description}
                onChange={(e) => handleChange('site', 'description', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="site-url" className="block text-sm font-medium text-gray-700">
                URL сайта
              </label>
              <input
                type="url"
                id="site-url"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={config.site.url}
                onChange={(e) => handleChange('site', 'url', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="theme-color" className="block text-sm font-medium text-gray-700">
                Цвет темы
              </label>
              <input
                type="color"
                id="theme-color"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={config.settings.themeColor}
                onChange={(e) => handleChange('settings', 'themeColor', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Контактная информация */}
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Контактная информация
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Телефон
              </label>
              <input
                type="tel"
                id="phone"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={config.contacts.phone}
                onChange={(e) => handleChange('contacts', 'phone', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={config.contacts.email}
                onChange={(e) => handleChange('contacts', 'email', e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Адрес
              </label>
              <input
                type="text"
                id="address"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={config.contacts.address}
                onChange={(e) => handleChange('contacts', 'address', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="working-hours" className="block text-sm font-medium text-gray-700">
                Часы работы
              </label>
              <input
                type="text"
                id="working-hours"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={config.contacts.workingHours}
                onChange={(e) => handleChange('contacts', 'workingHours', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Социальные сети */}
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Социальные сети
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                Instagram
              </label>
              <input
                type="url"
                id="instagram"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={config.social.instagram}
                onChange={(e) => handleChange('social', 'instagram', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="vk" className="block text-sm font-medium text-gray-700">
                VK
              </label>
              <input
                type="url"
                id="vk"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={config.social.vk}
                onChange={(e) => handleChange('social', 'vk', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="telegram" className="block text-sm font-medium text-gray-700">
                Telegram
              </label>
              <input
                type="url"
                id="telegram"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={config.social.telegram}
                onChange={(e) => handleChange('social', 'telegram', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
                WhatsApp
              </label>
              <input
                type="url"
                id="whatsapp"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={config.social.whatsapp}
                onChange={(e) => handleChange('social', 'whatsapp', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Сохранить настройки'}
          </button>
        </div>
      </form>
    </div>
  );
}
