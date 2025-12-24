import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { FixedHeader } from '@/components/layout/FixedHeader';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { theme } from '@/lib/theme';
import { useCartStore } from '@/lib/cart-store';
import { useNavigation, useRoute } from '@react-navigation/native';

interface ProductDetailScreenParams {
  productId: string;
}

const productData = {
  '1': {
    id: '1',
    title: 'Dank Meme Tee',
    price: 29.99,
    image: { uri: 'https://via.placeholder.com/300x300/FF6B35/FFFFFF?text=Dank+Meme+Tee' },
    description: 'The most fire meme you\'ve ever seen. This shirt will make you the talk of the town and probably get you some weird looks, but hey, that\'s the price of being legendary.',
    features: [
      '100% Premium Cotton',
      'High-quality print that won\'t fade',
      'Comfortable fit for all body types',
      'Machine washable',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Navy'],
  },
  '2': {
    id: '2',
    title: 'Viral Sensation',
    price: 34.99,
    image: { uri: 'https://via.placeholder.com/300x300/4CAF50/FFFFFF?text=Viral+Sensation' },
    description: 'Break the internet with this one. When you wear this shirt, you\'re not just wearing fabric - you\'re wearing a statement. A very loud, very meme-y statement.',
    features: [
      '100% Premium Cotton',
      'High-quality print that won\'t fade',
      'Comfortable fit for all body types',
      'Machine washable',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Navy'],
  },
