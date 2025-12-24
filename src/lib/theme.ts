import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Layout constants
export const LAYOUT = {
  HEADER_HEIGHT: 64,
  BOTTOM_NAV_HEIGHT: 72,
  CONTENT_OVERLAP: 12,
  CONTENT_PADDING_TOP: 24,
  CONTENT_PADDING_BOTTOM: 16,
  BORDER_RADIUS: 24,
  CARD_RADIUS: 12,
  BUTTON_RADIUS: 8,
} as const;

// Colors - macOS inspired
export const COLORS = {
  // Primary brand colors
  primary: '#007AFF',
  primaryDark: '#0056CC',
  primaryLight: '#4DA3FF',
  
  // Secondary colors
  secondary: '#5856D6',
  secondaryDark: '#3634A3',
  secondaryLight: '#7A79E0',
  
  // Success colors
  success: '#34C759',
  successDark: '#28A745',
  successLight: '#5CD675',
  
  // Warning colors
  warning: '#FF9500',
  warningDark: '#E6850E',
  warningLight: '#FFB340',
  
  // Error colors
  error: '#FF3B30',
  errorDark: '#D70015',
  errorLight: '#FF6961',
  
  // Neutral colors
  background: '#FFFFFF',
  surface: '#F2F2F7',
  surfaceDark: '#E5E5EA',
  surfaceLight: '#FAFAFA',
  
  // Text colors
  text: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  textInverse: '#FFFFFF',
  
  // Border colors
