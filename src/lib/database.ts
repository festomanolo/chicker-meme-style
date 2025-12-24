import { storage, storageUtils } from './storage';
import { PasswordUtils } from './crypto';

const DATABASE_NAME = 'chicker.db';

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
}

export interface PaymentIntent {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  created_at: number;
}

