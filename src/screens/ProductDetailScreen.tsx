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
                        selectedColor === color && styles.optionTextActive,
                      ]}
                    >
                      {color}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Quantity Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quantity</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(quantity - 1)}
                  activeOpacity={0.7}
                >
                  <Icon name="remove" size={20} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(quantity + 1)}
                  activeOpacity={0.7}
                >
                  <Icon name="add" size={20} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Features */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Features</Text>
              {product.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Icon name="checkmark-circle" size={16} color={theme.colors.success} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Add to Cart Button */}
        <View style={styles.addToCartContainer}>
          <View style={styles.priceContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalPrice}>${(product.price * quantity).toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
            activeOpacity={0.8}
          >
            <Icon name="cart" size={20} color={theme.colors.textInverse} />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ContentContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...theme.typography.text.h3,
    color: theme.colors.textSecondary,
  },
  imageContainer: {
    marginBottom: theme.spacing.lg,
  },
  productImage: {
    width: '100%',
    height: 300,
    borderRadius: theme.layout.CARD_RADIUS,
  },
  productInfo: {
    paddingHorizontal: theme.spacing.lg,
  },
  productTitle: {
    ...theme.typography.text.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  productPrice: {
    ...theme.typography.text.h3,
    color: theme.colors.primary,
    fontWeight: '700',
    marginBottom: theme.spacing.lg,
  },
  productDescription: {
    ...theme.typography.text.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
