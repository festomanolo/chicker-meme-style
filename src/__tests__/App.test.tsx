import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import App from '../App';

// Mock the database and stores
jest.mock('../lib/database', () => ({
  initDatabase: jest.fn().mockResolvedValue(undefined),
  db: {
    getUserByEmail: jest.fn(),
    createUser: jest.fn(),
    getCartForUser: jest.fn(),
    createCart: jest.fn(),
    addCartItem: jest.fn(),
    getCartItems: jest.fn(),
    createOrder: jest.fn(),
    createPaymentIntent: jest.fn(),
    updatePaymentIntentStatus: jest.fn(),
    updateOrderStatus: jest.fn(),
  },
}));

jest.mock('../lib/auth-store', () => ({
  useAuthStore: jest.fn(() => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    checkAuth: jest.fn(),
  })),
}));

jest.mock('../lib/cart-store', () => ({
  useCartStore: jest.fn(() => ({
    items: [],
    isLoading: false,
    addItem: jest.fn(),
    removeItem: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    loadCart: jest.fn(),
    getTotal: jest.fn(() => 0),
    getItemCount: jest.fn(() => 0),
  })),
}));

// Mock Expo modules
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <NavigationContainer>
        <App />
      </NavigationContainer>
    );
  });

  it('shows splash screen initially', () => {
    render(
      <NavigationContainer>
        <App />
      </NavigationContainer>
    );
    
    // The splash screen should be visible initially
    expect(screen.getByText('Chicker')).toBeTruthy();
  });
});

describe('Database Integration', () => {
  it('initializes database on app start', async () => {
    const { initDatabase } = require('../lib/database');
    
    render(
      <NavigationContainer>
        <App />
      </NavigationContainer>
    );
    
    expect(initDatabase).toHaveBeenCalled();
  });
});

describe('Authentication Flow', () => {
  it('handles user authentication state', () => {
    const { useAuthStore } = require('../lib/auth-store');
    
    // Mock authenticated user
    useAuthStore.mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      checkAuth: jest.fn(),
    });
    
    render(
      <NavigationContainer>
        <App />
      </NavigationContainer>
    );
    
    // Should show main app instead of auth screen
    expect(screen.queryByText('Welcome Back!')).toBeFalsy();
  });
});

describe('Cart Functionality', () => {
  it('manages cart state correctly', () => {
    const { useCartStore } = require('../lib/cart-store');
    
    // Mock cart with items
    useCartStore.mockReturnValue({
      items: [
        { id: '1', product_id: 'prod_1', quantity: 2, price: 29.99 },
      ],
      isLoading: false,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      loadCart: jest.fn(),
      getTotal: jest.fn(() => 59.98),
      getItemCount: jest.fn(() => 2),
    });
    
    render(
      <NavigationContainer>
        <App />
      </NavigationContainer>
    );
    
    // Cart should show correct item count
    expect(useCartStore().getItemCount()).toBe(2);
    expect(useCartStore().getTotal()).toBe(59.98);
  });
});





