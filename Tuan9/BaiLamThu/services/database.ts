import * as SQLite from 'expo-sqlite';

export interface Task {
  id: number;
  title: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  createdAt: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initDatabase(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('expense_tracker.db');
      await this.createTables();
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
        createdAt TEXT NOT NULL
      );
    `;

    await this.db.execAsync(createTableQuery);
  }

  async addTransaction(title: string, amount: number, category: string, type: 'income' | 'expense'): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const insertQuery = `
      INSERT INTO transactions (title, amount, category, type, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `;

    const createdAt = new Date().toISOString();
    const result = await this.db.runAsync(insertQuery, [title, amount, category, type, createdAt]);
    
    return result.lastInsertRowId;
  }

  async getAllTransactions(): Promise<Task[]> {
    if (!this.db) throw new Error('Database not initialized');

    const selectQuery = 'SELECT * FROM transactions ORDER BY createdAt DESC';
    const result = await this.db.getAllAsync(selectQuery);
    
    return result as Task[];
  }

  async deleteTransaction(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const deleteQuery = 'DELETE FROM transactions WHERE id = ?';
    await this.db.runAsync(deleteQuery, [id]);
  }

  async getTransactionById(id: number): Promise<Task | null> {
    if (!this.db) throw new Error('Database not initialized');

    const selectQuery = 'SELECT * FROM transactions WHERE id = ?';
    const result = await this.db.getFirstAsync(selectQuery, [id]);
    
    return result as Task || null;
  }
}

export const databaseService = new DatabaseService();
