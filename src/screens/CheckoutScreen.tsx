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
