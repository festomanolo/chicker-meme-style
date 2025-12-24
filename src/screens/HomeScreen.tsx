import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@/lib/theme';

interface ProductCard {
  id: string;
  title: string;
  price: number;
  emoji: string;
  description: string;
}

const featuredProducts: ProductCard[] = [
  {
    id: '1',
    title: 'Dank Meme Tee',
    price: 29.99,
    emoji: '🔥',
    description: 'The most fire meme you\'ve ever seen',
  },
  {
    id: '2',
    title: 'Viral Sensation',
    price: 34.99,
    emoji: '🚀',
    description: 'Break the internet with this one',
  },
  {
    id: '3',
    title: 'Epic Fail Collection',
    price: 27.99,
    emoji: '😂',
    description: 'Because we all need a good laugh',
  },
  {
    id: '4',
    title: 'Legendary Status',
    price: 39.99,
    emoji: '👑',
    description: 'Achievement unlocked: Style Master',
  },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleProductPress = (productId: string) => {
    // TODO: Navigate to ProductDetail screen when implemented
    console.log('Navigate to product:', productId);
  };
