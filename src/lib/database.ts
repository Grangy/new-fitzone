import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(dbPath);
  }

  async initialize() {
    await this.init();
  }

  private async init() {
    const run = promisify(this.db.run.bind(this.db));
    
    try {
      // Создание таблиц
      await run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'admin',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS site_config (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE NOT NULL,
          value TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS clubs (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          address TEXT NOT NULL,
          phone TEXT NOT NULL,
          whatsapp TEXT,
          telegram TEXT,
          vk TEXT,
          instagram TEXT,
          description TEXT,
          photos TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS trainers (
          id TEXT PRIMARY KEY,
          club_id TEXT NOT NULL,
          name TEXT NOT NULL,
          specialty TEXT NOT NULL,
          experience TEXT NOT NULL,
          image TEXT,
          certifications TEXT,
          bio TEXT,
          schedule TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (club_id) REFERENCES clubs (id)
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS directions (
          id TEXT PRIMARY KEY,
          club_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          image TEXT,
          price TEXT NOT NULL,
          duration TEXT NOT NULL,
          level TEXT NOT NULL,
          schedule TEXT,
          trainer TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (club_id) REFERENCES clubs (id)
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS schedules (
          id TEXT PRIMARY KEY,
          club_id TEXT NOT NULL,
          title TEXT NOT NULL,
          trainer TEXT NOT NULL,
          schedule_data TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (club_id) REFERENCES clubs (id)
        )
      `);

      // Таблицы для квиза
      await run(`
        CREATE TABLE IF NOT EXISTS quiz_questions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          question TEXT NOT NULL,
          question_type TEXT NOT NULL DEFAULT 'single',
          order_index INTEGER NOT NULL,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS quiz_answers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          question_id INTEGER NOT NULL,
          answer_text TEXT NOT NULL,
          answer_value TEXT NOT NULL,
          order_index INTEGER NOT NULL,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (question_id) REFERENCES quiz_questions (id) ON DELETE CASCADE
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS quiz_recommendations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          conditions TEXT NOT NULL,
          trainer_ids TEXT,
          direction_ids TEXT,
          club_ids TEXT,
          priority INTEGER DEFAULT 1,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS quiz_results (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id TEXT NOT NULL,
          answers TEXT NOT NULL,
          recommendations TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  async get(query: string, params: unknown[] = []): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async all(query: string, params: unknown[] = []): Promise<unknown[]> {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async run(query: string, params: unknown[] = []): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function(err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  close() {
    this.db.close();
  }
}

export const database = new Database();
