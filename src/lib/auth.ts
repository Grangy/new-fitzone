import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { database } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface User {
  id: string;
  username: string;
  role: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export async function authenticateUser(username: string, password: string): Promise<AuthResult> {
  try {
    const user = await database.get(
      'SELECT * FROM users WHERE username = ?',
      [username]
    ) as { id: string; username: string; password: string; role: string } | null;

    if (!user) {
      return { success: false, error: 'Пользователь не найден' };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { success: false, error: 'Неверный пароль' };
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      token
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, error: 'Ошибка аутентификации' };
  }
}

export async function createUser(username: string, password: string, role: string = 'admin'): Promise<AuthResult> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await database.run(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role]
    );

    return {
      success: true,
      user: {
        id: result.lastID.toString(),
        username,
        role
      }
    };
  } catch (error) {
    console.error('User creation error:', error);
    return { success: false, error: 'Ошибка создания пользователя' };
  }
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string; role: string };
    return {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    };
  } catch {
    return null;
  }
}

export async function initializeAdminUser() {
  try {
    const existingAdmin = await database.get('SELECT * FROM users WHERE role = "admin"') as { id: string } | null;
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await database.run(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        ['admin', hashedPassword, 'admin']
      );
      console.log('Admin user created: admin / admin123');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
}
