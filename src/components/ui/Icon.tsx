import React from 'react';
import { Text, TextStyle } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

// Simple icon mapping using Unicode symbols
const iconMap: Record<string, string> = {
  'home': '🏠',
  'search': '🔍',
  'cart': '🛒',
  'person': '👤',
  'add': '➕',
  'remove': '➖',
  'heart': '❤️',
  'heart-outline': '🤍',
  'star': '⭐',
  'star-outline': '☆',
  'arrow-back': '←',
  'arrow-forward': '→',
  'close': '✕',
  'checkmark': '✓',
  'trash': '🗑️',
  'settings': '⚙️',
  'menu': '☰',
  'filter': '🔽',
  'share': '📤',
  'location': '📍',
  'phone': '📞',
  'mail': '✉️',
  'time': '🕐',
  'calendar': '📅',
  'camera': '📷',
  'image': '🖼️',
  'document': '📄',
  'folder': '📁',
  'download': '⬇️',
  'upload': '⬆️',
  'refresh': '🔄',
  'lock': '🔒',
