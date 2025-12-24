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

interface TabItem {
  name: string;
  icon: string;
  label: string;
}

const tabs: TabItem[] = [
  { name: 'Home', icon: 'home', label: 'Home' },
  { name: 'Discover', icon: 'search', label: 'Discover' },
  { name: 'Cart', icon: 'cart', label: 'Cart' },
  { name: 'Account', icon: 'person', label: 'Account' },
];

export const BottomNav: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { getItemCount } = useCartStore();

  const currentRouteName = route.name;
  const cartItemCount = getItemCount();

  const handleTabPress = (tabName: string) => {
    if (tabName !== currentRouteName) {
      navigation.navigate(tabName as never);
    }
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = currentRouteName === tab.name;
          const isCart = tab.name === 'Cart';
