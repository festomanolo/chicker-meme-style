// Web storage abstraction backed by localStorage with in-memory fallback
export interface StorageInterface {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

const memoryStore = new Map<string, string>();

class WebStorage implements StorageInterface {
  private hasLocalStorage(): boolean {
    try {
      return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    } catch {
      return false;
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      if (this.hasLocalStorage()) {
        return window.localStorage.getItem(key);
      }
      return memoryStore.get(key) ?? null;
    } catch {
      return memoryStore.get(key) ?? null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      memoryStore.set(key, value);
      if (this.hasLocalStorage()) {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      memoryStore.delete(key);
      if (this.hasLocalStorage()) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      memoryStore.clear();
      if (this.hasLocalStorage()) {
        window.localStorage.clear();
      }
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

export const storage: StorageInterface = new WebStorage();

export const storageUtils = {
  async getJSON<T>(key: string): Promise<T | null> {
    try {
      const item = await storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  async setJSON(key: string, value: unknown): Promise<void> {
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