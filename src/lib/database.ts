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

class Database {
  async init(): Promise<void> {
    // Initialize storage keys if they don't exist
    const keys = ['users', 'carts', 'cart_items', 'orders', 'payment_intents'];
    for (const key of keys) {
      const existing = await storageUtils.getJSON(key);
      if (!existing) {
        await storageUtils.setJSON(key, []);
      }
    }
    
    // Create demo user if it doesn't exist
    await this.createDemoUser();
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

  private async getCollection(key: string): Promise<any[]> {
    return await storageUtils.getJSON(key) || [];
  }

  private async setCollection(key: string, data: any[]): Promise<void> {
    await storageUtils.setJSON(key, data);
  }

  // User functions
  async createUser(user: Omit<User, 'created_at'>): Promise<void> {
    const users = await this.getCollection('users');
    const newUser = { ...user, created_at: Date.now() };
    users.push(newUser);
    await this.setCollection('users', users);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getCollection('users');
    return users.find(user => user.email === email) || null;
  }

  async getUserById(id: string): Promise<User | null> {
    const users = await this.getCollection('users');
    return users.find(user => user.id === id) || null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    const users = await this.getCollection('users');
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      await this.setCollection('users', users);
    }
  }

  // Cart functions
  async getCartForUser(userId: string): Promise<Cart | null> {
    const carts = await this.getCollection('carts');
    return carts.find(cart => cart.user_id === userId) || null;
  }

  async createCart(userId: string): Promise<string> {
    const cartId = `cart_${Date.now()}`;
    const carts = await this.getCollection('carts');
    carts.push({ id: cartId, user_id: userId, created_at: Date.now() });
    await this.setCollection('carts', carts);
    return cartId;
  }

  async addCartItem(cartItem: Omit<CartItem, 'id'>): Promise<string> {
    const itemId = `item_${Date.now()}`;
    const items = await this.getCollection('cart_items');
    items.push({ id: itemId, ...cartItem });
    await this.setCollection('cart_items', items);
    return itemId;
  }

  async getCartItems(cartId: string): Promise<CartItem[]> {
    const items = await this.getCollection('cart_items');
    return items.filter(item => item.cart_id === cartId);
  }
