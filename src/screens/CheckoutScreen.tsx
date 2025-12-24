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
            
            <View style={styles.successActions}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Orders' as never)}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>View Orders</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Home' as never)}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ContentContainer>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <FixedHeader title="Checkout" />
        <ContentContainer>
          <View style={styles.emptyContainer}>
            <Icon name="cart" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>
              Add some items to your cart before checking out.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Home' as never)}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        </ContentContainer>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FixedHeader title="Checkout" />
      <ContentContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            {items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name || `Product ${item.product_id}`}</Text>
                  <Text style={styles.itemDetails}>
                    Qty: {item.quantity} × ${item.price}
                  </Text>
                </View>
                <Text style={styles.itemTotal}>
                  ${(item.quantity * item.price).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Shipping Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={shippingInfo.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.input}
                value={shippingInfo.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                value={shippingInfo.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address *</Text>
              <TextInput
                style={styles.input}
                value={shippingInfo.address}
                onChangeText={(value) => handleInputChange('address', value)}
                placeholder="Enter your address"
                multiline
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>City *</Text>
              <TextInput
                style={styles.input}
                value={shippingInfo.city}
                onChangeText={(value) => handleInputChange('city', value)}
                placeholder="Enter your city"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Country</Text>
              <TextInput
                style={styles.input}
                value={shippingInfo.country}
                onChangeText={(value) => handleInputChange('country', value)}
                placeholder="Enter your country"
              />
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentMethod}>
              <Icon name="card" size={24} color={theme.colors.primary} />
              <Text style={styles.paymentText}>Mock Payment (Demo)</Text>
            </View>
          </View>

          {/* Order Total */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Total</Text>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping</Text>
              <Text style={styles.totalValue}>
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax (18%)</Text>
              <Text style={styles.totalValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.totalRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Total</Text>
