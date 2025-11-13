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
  'unlock': '🔓',
  'eye': '👁️',
  'eye-off': '🙈',
  'warning': '⚠️',
  'information': 'ℹ️',
  'success': '✅',
  'error': '❌',
  'logout': '🚪',
  'receipt-outline': '🧾',
  'person-outline': '👤',
  'settings-outline': '⚙️',
  'help-circle-outline': '❓',
  'information-circle-outline': 'ℹ️',
  'chevron-forward': '▶️',
  'log-out-outline': '🚪',
  'card-outline': '💳',
  'card': '💳',
  'checkmark-circle': '✅',
};

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = '#000', 
  style 
}) => {
  const iconSymbol = iconMap[name] || '?';
  
  return (
    <Text 
      style={[
        {
          fontSize: size,
          color,
          textAlign: 'center',
          lineHeight: size,
        },
        style
      ]}
    >
      {iconSymbol}
    </Text>
  );
};