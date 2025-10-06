import { database } from './database';
import { initializeAdminUser } from './auth';

export async function initializeDatabase() {
  try {
    // Инициализируем базу данных
    await database.initialize();
    
    // Создаем админ пользователя если его нет
    await initializeAdminUser();
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
