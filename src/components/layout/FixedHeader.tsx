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

  const handleCartPress = () => {
    if (onCartPress) {
      onCartPress();
    } else {
      navigation.navigate('Cart' as never);
    }
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {shouldShowBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              activeOpacity={0.7}
            >
              <Icon name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          )}
        </View>

        {/* Center Section - Title */}
        <View style={styles.centerSection}>
          <Text style={styles.title} numberOfLines={1}>
            {displayTitle}
          </Text>
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {showCart && (
            <TouchableOpacity
              style={styles.cartButton}
              onPress={handleCartPress}
              activeOpacity={0.7}
            >
              <Icon name="cart" size={24} color={theme.colors.text} />
              {cartItemCount > 0 && (
                <View style={styles.cartBadge}>
