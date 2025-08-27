import React from 'react';
import { View } from 'react-native';

// Mock initial window metrics
export const initialWindowMetrics = {
  frame: { x: 0, y: 0, width: 375, height: 667 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

// Mock contexts
export const SafeAreaInsetsContext = React.createContext(initialWindowMetrics.insets);
export const SafeAreaFrameContext = React.createContext(initialWindowMetrics.frame);

// Mock SafeAreaProvider for web builds
export const SafeAreaProvider: React.FC<{ children: React.ReactNode; initialMetrics?: any }> = ({ children }) => {
  return React.createElement(View, { style: { flex: 1 } }, children);
};

// Mock SafeAreaView for web builds
export const SafeAreaView: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => {
  return React.createElement(View, { style }, children);
};

// Mock useSafeAreaInsets hook
