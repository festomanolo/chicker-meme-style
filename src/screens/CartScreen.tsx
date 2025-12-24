import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '@/lib/cart-store';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth <= 420;

// Import CartItem from database types
import { CartItem } from '@/lib/database';

// Remove mock data - we'll use real cart data

export const CartScreen: React.FC = () => {
  const navigation = useNavigation();
  const { items: cartItems, updateQuantity, removeItem, getTotal, isLoading: cartLoading, loadCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const total = getTotal();

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      Alert.alert(
        'Remove Item',
        'Would you like to remove this item from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => handleRemoveItem(itemId) },
        ]
      );
      return;
    }
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      Alert.alert('Error', 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId);
    } catch (error) {
      Alert.alert('Error', 'Failed to remove item');
