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
