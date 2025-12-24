import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@/components/ui/Icon';
import { FixedHeader } from '@/components/layout/FixedHeader';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { theme } from '@/lib/theme';
import { useCartStore } from '@/lib/cart-store';
import { useAuthStore } from '@/lib/auth-store';
import { db } from '@/lib/database';

export const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation();
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    country: 'Tanzania',
    phone: '',
  });

  const subtotal = getTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.18; // 18% VAT
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['name', 'email', 'address', 'city', 'phone'];
    for (const field of required) {
      if (!shippingInfo[field as keyof typeof shippingInfo].trim()) {
        Alert.alert('Error', `Please fill in ${field}`);
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    if (items.length === 0) {
      Alert.alert('Error', 'Your cart is empty');
      return;
    }

    setIsProcessing(true);
    try {
      // Create order in database
      const newOrderId = await db.createOrder(user!.id, items, total, shippingInfo);
      
      // Clear cart
      await clearCart();
      
      setOrderId(newOrderId);
      setOrderComplete(true);
      
      Alert.alert(
        'Order Placed Successfully!',
        `Your order ${newOrderId} has been placed. You will receive a confirmation email shortly.`,
        [
          {
            text: 'View Orders',
            onPress: () => navigation.navigate('Orders' as never),
          },
          {
            text: 'Continue Shopping',
            onPress: () => navigation.navigate('Home' as never),
          },
        ]
      );
    } catch (error) {
      console.error('Order creation failed:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <View style={styles.container}>
        <FixedHeader title="Order Complete" showCart={false} />
        <ContentContainer>
          <View style={styles.successContainer}>
            <Icon name="success" size={64} color={theme.colors.success} />
            <Text style={styles.successTitle}>Order Placed Successfully!</Text>
            <Text style={styles.successSubtitle}>
              Order ID: {orderId}
            </Text>
            <Text style={styles.successDescription}>
              Thank you for your order! You will receive a confirmation email shortly.
            </Text>
            
