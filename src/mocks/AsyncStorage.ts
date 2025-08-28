// Web-compatible AsyncStorage mock using localStorage
const AsyncStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('AsyncStorage getItem error:', error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('AsyncStorage setItem error:', error);
      throw error;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('AsyncStorage removeItem error:', error);
      throw error;
    }
  },

  async multiGet(keys: string[]): Promise<[string, string | null][]> {
    try {
      return keys.map(key => [key, localStorage.getItem(key)]);
    } catch (error) {
      console.warn('AsyncStorage multiGet error:', error);
