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

  const renderProductCard = (product: ProductCard) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      onPress={() => handleProductPress(product.id)}
      activeOpacity={0.8}
    >
      <View style={styles.productImageContainer}>
        <Text style={styles.productEmoji}>{product.emoji}</Text>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <Text style={styles.productPrice}>${product.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>
          Welcome to the{' '}
          <Text style={styles.heroTitleAccent}>Memeverse</Text>
        </Text>
        <Text style={styles.heroSubtitle}>
          Where every shirt tells a story, and every story is absolutely{' '}
          <Text style={styles.heroSubtitleAccent}>ridiculous</Text>
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Discover' as never)}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>🔍</Text>
          <Text style={styles.actionText}>Discover</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Cart' as never)}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>🛒</Text>
          <Text style={styles.actionText}>Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Account' as never)}
          activeOpacity={0.8}
