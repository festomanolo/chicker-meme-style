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
        >
          <Text style={styles.actionIcon}>👤</Text>
          <Text style={styles.actionText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            🔥 <Text style={styles.sectionTitleText}>Trending Now</Text> 🔥
          </Text>
          <Text style={styles.sectionSubtitle}>
            The memes that are breaking the internet
          </Text>
        </View>
        
        <View style={styles.productsGrid}>
          {featuredProducts.map(renderProductCard)}
        </View>
      </View>

      {/* Meme of the Day */}
      <View style={styles.memeOfTheDay}>
        <Text style={styles.memeTitle}>🎯 Meme of the Day</Text>
        <View style={styles.memeCard}>
          <View style={styles.memeImageContainer}>
            <Text style={styles.memeEmoji}>🔥</Text>
          </View>
          <View style={styles.memeContent}>
            <Text style={styles.memeCardTitle}>"This is fine"</Text>
            <Text style={styles.memeCardDescription}>
              Perfect for when everything is definitely NOT fine, but you're just going with it anyway.
            </Text>
            <TouchableOpacity
              style={styles.memeButton}
              onPress={() => handleProductPress('1')}
              activeOpacity={0.8}
            >
              <Text style={styles.memeButtonText}>Get This Vibe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Call to Action */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Level Up?</Text>
        <Text style={styles.ctaSubtitle}>
          Join thousands of meme lords who've already upgraded their wardrobe
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Discover' as never)}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaButtonText}>Start Shopping →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  heroTitle: {
    fontSize: 32,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 40,
    fontWeight: '700',
  },
  heroTitleAccent: {
    color: '#FF6B35',
    fontWeight: '800',
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 28,
  },
  heroSubtitleAccent: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    minWidth: 80,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '700',
  },
  sectionTitleText: {
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    // Native fallback
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productEmoji: {
    fontSize: 48,
  },
  productInfo: {
    padding: 16,
  },
  productTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '700',
  },
  memeOfTheDay: {
    marginBottom: 32,
  },
  memeTitle: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '700',
  },
  memeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    // Native fallback
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  memeImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memeEmoji: {
    fontSize: 80,
  },
  memeContent: {
    padding: 24,
  },
  memeCardTitle: {
    fontSize: 20,
    color: '#333',
    marginBottom: 8,
    fontWeight: '700',
  },
  memeCardDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 24,
  },
  memeButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  memeButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  ctaSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingBottom: 50,
  },
  ctaTitle: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '700',
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});





