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
};

export const ProductDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params as ProductDetailScreenParams;
  const { addItem } = useCartStore();

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('White');
  const [quantity, setQuantity] = useState(1);

  const product = productData[productId as keyof typeof productData];

  if (!product) {
    return (
      <View style={styles.container}>
        <FixedHeader title="Product" showBack />
        <ContentContainer>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Product not found</Text>
          </View>
        </ContentContainer>
      </View>
    );
  }

  const handleAddToCart = async () => {
    try {
      await addItem(product.id, quantity, product.price, product.title, selectedSize, selectedColor);
      Alert.alert('Success', 'Added to cart!', [
        { text: 'Continue Shopping', onPress: () => navigation.goBack() },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart' as never) },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <View style={styles.container}>
      <FixedHeader title="Product" showBack />
      <ContentContainer>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Product Image */}
          <View style={styles.imageContainer}>
            <Image source={product.image} style={styles.productImage} />
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{product.title}</Text>
            <Text style={styles.productPrice}>${product.price}</Text>
            <Text style={styles.productDescription}>{product.description}</Text>

            {/* Size Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Size</Text>
              <View style={styles.optionsContainer}>
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.optionButton,
                      selectedSize === size && styles.optionButtonActive,
                    ]}
                    onPress={() => setSelectedSize(size)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedSize === size && styles.optionTextActive,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Color Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Color</Text>
              <View style={styles.optionsContainer}>
                {product.colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.optionButton,
                      selectedColor === color && styles.optionButtonActive,
                    ]}
                    onPress={() => setSelectedColor(color)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
