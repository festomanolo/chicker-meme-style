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
