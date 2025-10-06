import { database } from '../lib/database';
import { initializeAdminUser } from '../lib/auth';
import { siteConfig } from '../lib/siteConfig';

// Данные клубов из ClubContext
const clubsData = [
  {
    id: 'pionerskaya',
    name: 'ул. Пионерская',
    address: 'ул. Пионерская, 15',
    phone: '+7 (8617) 123-45-67',
    whatsapp: 'https://wa.me/786171234567',
    telegram: 'https://t.me/fitzone_pionerskaya',
    vk: 'https://vk.com/fitzone_pionerskaya',
    instagram: 'https://instagram.com/fitzone_pionerskaya',
    description: 'Современный фитнес-клуб в центре города с полным спектром услуг',
    photos: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    trainers: [
      {
        id: 'anna-pionerskaya',
        name: 'Анна Петрова',
        specialty: 'Йога и Пилатес',
        experience: '8 лет опыта',
        image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        certifications: ['RYT-500', 'Pilates Mat', 'Yin Yoga'],
        bio: 'Сертифицированный инструктор йоги с 8-летним опытом. Специализируется на хатха-йоге, виньяса-флоу и восстановительной йоге.',
        schedule: ['Пн, Ср, Пт: 09:00-10:00', 'Вт, Чт: 18:00-19:00']
      },
      {
        id: 'dmitry-pionerskaya',
        name: 'Дмитрий Волков',
        specialty: 'Кроссфит и Функциональный тренинг',
        experience: '6 лет опыта',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        certifications: ['CrossFit L2', 'FMS', 'Olympic Weightlifting'],
        bio: 'Мастер спорта по тяжелой атлетике. Специализируется на функциональном тренинге и кроссфите.',
        schedule: ['Пн, Ср, Пт: 07:00-08:00', 'Вт, Чт: 19:00-20:00']
      }
    ],
    directions: [
      {
        id: 'zumba-pionerskaya',
        title: 'Зумба',
        description: 'Танцевальная фитнес-программа под латиноамериканскую музыку. Сжигай калории и получай удовольствие!',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        price: 'от 800₽',
        duration: '60 мин',
        level: 'Для всех уровней',
        schedule: ['Пн, Ср, Пт: 19:00', 'Сб: 10:00'],
        trainer: 'Анна Петрова'
      },
      {
        id: 'yoga-pionerskaya',
        title: 'Йога',
        description: 'Гармония тела и духа. Улучши гибкость, силу и найди внутренний баланс.',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        price: 'от 800₽',
        duration: '60 мин',
        level: 'Для всех уровней',
        schedule: ['Пн, Ср, Пт: 09:00', 'Вт, Чт: 18:00'],
        trainer: 'Анна Петрова'
      }
    ]
  },
  {
    id: 'mira',
    name: 'ул. Мира',
    address: 'ул. Мира, 42',
    phone: '+7 (8617) 234-56-78',
    whatsapp: 'https://wa.me/786172345678',
    telegram: 'https://t.me/fitzone_mira',
    vk: 'https://vk.com/fitzone_mira',
    instagram: 'https://instagram.com/fitzone_mira',
    description: 'Новый современный фитнес-центр с передовым оборудованием',
    photos: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    ],
    trainers: [
      {
        id: 'elena-mira',
        name: 'Елена Смирнова',
        specialty: 'Персональные тренировки',
        experience: '10 лет опыта',
        image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        certifications: ['NASM-CPT', 'Nutrition Coach', 'TRX'],
        bio: 'Сертифицированный персональный тренер с 10-летним опытом. Специализируется на коррекции фигуры и реабилитации.',
        schedule: ['Пн-Пт: 08:00-20:00', 'Сб: 09:00-15:00']
      },
      {
        id: 'mikhail-mira',
        name: 'Михаил Козлов',
        specialty: 'Пилатес и Функциональный тренинг',
        experience: '7 лет опыта',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
        certifications: ['Pilates Mat', 'Reformer', 'Functional Training'],
        bio: 'Сертифицированный инструктор пилатеса. Специализируется на работе с позвоночником и коррекции осанки.',
        schedule: ['Пн, Ср, Пт: 10:00-11:00', 'Вт, Чт: 17:00-18:00']
      }
    ],
    directions: [
      {
        id: 'oriental-dance-mira',
        title: 'Восточные танцы',
        description: 'Экзотические танцы Востока. Развивай пластику, грацию и женственность.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        price: 'от 800₽',
        duration: '60 мин',
        level: 'Для всех уровней',
        schedule: ['Пн, Ср: 19:00', 'Сб: 11:00'],
        trainer: 'Елена Смирнова'
      }
    ]
  }
];

async function migrateData() {
  try {
    console.log('Начинаем миграцию данных...');

    // Инициализируем базу данных
    await database.initialize();

    // Инициализируем админ пользователя
    await initializeAdminUser();

    // Мигрируем конфигурацию сайта
    console.log('Мигрируем конфигурацию сайта...');
    for (const [key, value] of Object.entries(siteConfig)) {
      await database.run(`
        INSERT OR REPLACE INTO site_config (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `, [key, JSON.stringify(value)]);
    }

    // Мигрируем клубы
    console.log('Мигрируем данные клубов...');
    for (const club of clubsData) {
      await database.run(`
        INSERT OR REPLACE INTO clubs (id, name, address, phone, whatsapp, telegram, vk, instagram, description, photos)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [club.id, club.name, club.address, club.phone, club.whatsapp, club.telegram, club.vk, club.instagram, club.description, JSON.stringify(club.photos)]);

      // Мигрируем тренеров
      for (const trainer of club.trainers) {
        await database.run(`
          INSERT OR REPLACE INTO trainers (id, club_id, name, specialty, experience, image, certifications, bio, schedule)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [trainer.id, club.id, trainer.name, trainer.specialty, trainer.experience, trainer.image, JSON.stringify(trainer.certifications), trainer.bio, JSON.stringify(trainer.schedule)]);
      }

      // Мигрируем направления
      for (const direction of club.directions) {
        await database.run(`
          INSERT OR REPLACE INTO directions (id, club_id, title, description, image, price, duration, level, schedule, trainer)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [direction.id, club.id, direction.title, direction.description, direction.image, direction.price, direction.duration, direction.level, JSON.stringify(direction.schedule), direction.trainer]);
      }
    }

    // Мигрируем расписания из siteConfig
    console.log('Мигрируем расписания...');
    for (const [scheduleId, scheduleData] of Object.entries(siteConfig.schedules)) {
      const clubId = scheduleId.split('-')[1]; // Извлекаем club_id из scheduleId
      await database.run(`
        INSERT OR REPLACE INTO schedules (id, club_id, title, trainer, schedule_data)
        VALUES (?, ?, ?, ?, ?)
      `, [scheduleId, clubId, scheduleData.title, scheduleData.trainer, JSON.stringify(scheduleData.schedule)]);
    }

    console.log('Миграция данных завершена успешно!');
    console.log('Админ пользователь: admin / admin123');
  } catch (error) {
    console.error('Ошибка при миграции данных:', error);
  } finally {
    database.close();
  }
}

// Запускаем миграцию если файл выполняется напрямую
if (require.main === module) {
  migrateData();
}

export { migrateData };
