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
  border: '#C6C6C8',
  borderLight: '#E5E5EA',
  borderDark: '#8E8E93',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.1)',
  
  // Dark mode colors
  dark: {
    background: '#000000',
    surface: '#1C1C1E',
    surfaceDark: '#2C2C2E',
    surfaceLight: '#3A3A3C',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    textTertiary: '#48484A',
    border: '#38383A',
    borderLight: '#48484A',
    borderDark: '#2C2C2E',
  },
} as const;

// Typography - Friendly, rounded sans-serif
export const TYPOGRAPHY = {
  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 36,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  // Font weights
  fontWeight: {
    normal: '400',
