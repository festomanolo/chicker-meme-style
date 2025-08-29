// Platform-aware storage abstraction
interface StorageInterface {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

class WebStorage implements StorageInterface {
  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

class MobileStorage implements StorageInterface {
  private AsyncStorage: any;

  constructor() {
    // Dynamic import for React Native AsyncStorage
    try {
      this.AsyncStorage = require('@react-native-async-storage/async-storage').default;
    } catch {
      // Fallback to web storage if AsyncStorage is not available
      return new WebStorage() as any;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await this.AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await this.AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to save to AsyncStorage:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await this.AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from AsyncStorage:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear AsyncStorage:', error);
    }
  }
}

// Platform detection
const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
const isMobile = typeof navigator !== 'undefined' && /react-native/i.test(navigator.userAgent);

// Export the appropriate storage implementation
export const storage: StorageInterface = isWeb ? new WebStorage() : new MobileStorage();

// Utility functions for common operations
export const storageUtils = {
  async getJSON<T>(key: string): Promise<T | null> {
    try {
      const item = await storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  async setJSON(key: string, value: any): Promise<void> {
    try {
      await storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save JSON to storage:', error);
    }
  },

  async updateJSON<T>(key: string, updater: (current: T | null) => T): Promise<void> {
    try {
      const current = await this.getJSON<T>(key);
      const updated = updater(current);
      await this.setJSON(key, updated);
    } catch (error) {
      console.error('Failed to update JSON in storage:', error);
    }
  }
};