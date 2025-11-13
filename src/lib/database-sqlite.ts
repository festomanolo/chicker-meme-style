import SQLite from 'react-native-sqlite-storage';
import { PasswordUtils } from './crypto';

// Enable debugging
SQLite.DEBUG(false);
SQLite.enablePromise(true);

const DATABASE_NAME = 'chicker.db';
const DATABASE_VERSION = '1.0';
const DATABASE_DISPLAYNAME = 'Chicker Database';
const DATABASE_SIZE = 200000;

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: number;
}

export interface Cart {
  id: string;
  user_id: string;
  created_at: number;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  price: number;
  name?: string;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total: number;
  created_at: number;
  items: string; // JSON string
  shippingAddress: string; // JSON string
  date: string;
  tracking?: string;
  estimatedDelivery?: string;
}

class SQLiteDatabase {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: DATABASE_NAME,
        version: DATABASE_VERSION,
        displayName: DATABASE_DISPLAYNAME,
        size: DATABASE_SIZE,
      });

      await this.createTables();
      await this.createDemoUser();
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `;

    const createCartsTable = `
      CREATE TABLE IF NOT EXISTS carts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `;

    const createCartItemsTable = `
      CREATE TABLE IF NOT EXISTS cart_items (
        id TEXT PRIMARY KEY,
        cart_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        name TEXT,
        size TEXT,
        color TEXT,
        FOREIGN KEY (cart_id) REFERENCES carts (id)
      );
    `;

    const createOrdersTable = `
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        status TEXT NOT NULL,
        total REAL NOT NULL,
        items TEXT NOT NULL,
        shippingAddress TEXT NOT NULL,
        date TEXT NOT NULL,
        tracking TEXT,
        estimatedDelivery TEXT,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `;

    await this.db.executeSql(createUsersTable);
    await this.db.executeSql(createCartsTable);
    await this.db.executeSql(createCartItemsTable);
    await this.db.executeSql(createOrdersTable);
  }

  private async createDemoUser(): Promise<void> {
    const demoEmail = 'demo@chicker.com';
    const existingUser = await this.getUserByEmail(demoEmail);
    
    if (!existingUser) {
      const hashedPassword = await PasswordUtils.hashPassword('password123');
      await this.createUser({
        id: PasswordUtils.generateUserId(),
        name: 'Demo User',
        email: demoEmail,
        password_hash: hashedPassword,
      });
    }
  }

  // User functions
  async createUser(user: Omit<User, 'created_at'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    const query = `
      INSERT INTO users (id, name, email, password_hash, created_at)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    await this.db.executeSql(query, [
      user.id,
      user.name,
      user.email,
      user.password_hash,
      Date.now(),
    ]);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    const query = 'SELECT * FROM users WHERE email = ?';
    const [results] = await this.db.executeSql(query, [email]);
    
    if (results.rows.length > 0) {
