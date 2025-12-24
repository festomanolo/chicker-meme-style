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
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Text styles
  text: {
    h1: {
      fontSize: 32,
      lineHeight: 38,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 28,
      lineHeight: 34,
      fontWeight: '600',
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 24,
      lineHeight: 30,
      fontWeight: '600',
      letterSpacing: -0.2,
    },
    h4: {
      fontSize: 20,
      lineHeight: 26,
      fontWeight: '600',
      letterSpacing: -0.1,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
    },
    bodyLarge: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '400',
    },
    bodySmall: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
    },
    button: {
      fontSize: 16,
      lineHeight: 20,
      fontWeight: '600',
      letterSpacing: 0.1,
    },
    buttonSmall: {
      fontSize: 14,
      lineHeight: 18,
      fontWeight: '600',
      letterSpacing: 0.1,
    },
  },
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
} as const;

// Shadows
export const SHADOWS = {
  sm: {
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    // Native fallback
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    // Native fallback
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    // Native fallback
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
    // Native fallback
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
} as const;

// Animation
export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
} as const;

// Screen dimensions
export const SCREEN = {
  width: screenWidth,
  height: screenHeight,
  isSmall: screenWidth <= 375,
  isMedium: screenWidth > 375 && screenWidth <= 414,
  isLarge: screenWidth > 414,
} as const;

// Theme object
export const theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  shadows: SHADOWS,
  animation: ANIMATION,
  layout: LAYOUT,
  breakpoints: BREAKPOINTS,
  screen: SCREEN,
} as const;

export type Theme = typeof theme;
export type Colors = typeof COLORS;
export type Typography = typeof TYPOGRAPHY;





