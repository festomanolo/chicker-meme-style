import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from '@/components/ui/Icon';
import { theme } from '@/lib/theme';
import { useCartStore } from '@/lib/cart-store';

interface FixedHeaderProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  onBackPress?: () => void;
  onCartPress?: () => void;
}

export const FixedHeader: React.FC<FixedHeaderProps> = ({
  title,
  showBack = false,
  showCart = true,
  onBackPress,
  onCartPress,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { getItemCount } = useCartStore();

  const displayTitle = title || route.name;
  const canGoBack = navigation.canGoBack();
  const shouldShowBack = showBack || canGoBack;
  const cartItemCount = getItemCount();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (canGoBack) {
      navigation.goBack();
    }
  };
