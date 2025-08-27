import React from 'react';
import { View } from 'react-native';

// Mock Screen component for web builds
export const Screen: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => {
  return React.createElement(View, { style: { flex: 1, ...style } }, children);
};

// Mock ScreenContainer for web builds
export const ScreenContainer: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => {
  return React.createElement(View, { style: { flex: 1, ...style } }, children);
};

// Mock ScreenStack for web builds
export const ScreenStack: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => {
  return React.createElement(View, { style: { flex: 1, ...style } }, children);
};

// Mock enableScreens function
export const enableScreens = () => {
  // No-op for web
};

// Default export
export default {
  Screen,
  ScreenContainer,
  ScreenStack,
  enableScreens,
};