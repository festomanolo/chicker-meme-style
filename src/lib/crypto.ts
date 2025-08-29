// Simple password hashing utility for client-side use
// Note: In production, password hashing should be done server-side

export class PasswordUtils {
  // Simple hash function for demo purposes
  // In production, use bcrypt or similar on the server
  static async hashPassword(password: string): Promise<string> {
    // Use Web Crypto API if available (web), otherwise use a simple hash
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'chicker_salt_2024'); // Add salt
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (error) {
        console.error('Web Crypto API failed, using fallback:', error);
      }
    }
    
    // Fallback simple hash for mobile or if Web Crypto API fails
    return this.simpleHash(password + 'chicker_salt_2024');
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    const hashedInput = await this.hashPassword(password);
    return hashedInput === hash;
  }

  // Simple hash function fallback
  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Generate a random user ID
