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
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Add some items to your cart first!');
      return;
    }

    setIsLoading(true);
    try {
      // Navigate to checkout
      navigation.navigate('Checkout' as never);
    } catch (error) {
      Alert.alert('Error', 'Failed to proceed to checkout');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => console.log('Clear cart') },
      ]
    );
  };

  const renderCartItem = (item: CartItem) => (
    <View key={item.id} style={styles.cartItem}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Text style={styles.productEmoji}>🔥</Text>
      </View>

      {/* Product Details */}
      <View style={styles.productDetails}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.name || `Product ${item.product_id}`}
        </Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        {item.size && item.color && (
          <Text style={styles.productVariant}>
            Size: {item.size}, Color: {item.color}
          </Text>
        )}
        
        {/* Quantity Controls */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
            activeOpacity={0.7}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
            activeOpacity={0.7}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Item Total */}
        <Text style={styles.itemTotal}>
          Total: ${(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>

      {/* Remove Button */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.id)}
        activeOpacity={0.7}
      >
        <Text style={styles.removeButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛒 Cart</Text>
      </View>
      
      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartIcon}>🛒</Text>
          <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtitle}>
            Add some meme tees to get started!
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Home' as never)}
            activeOpacity={0.8}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Cart Items */}
          <View style={styles.cartItems}>
            {cartItems.map(renderCartItem)}
          </View>

          {/* Cart Summary */}
          <View style={styles.cartSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>Free</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearCart}
              activeOpacity={0.8}
            >
              <Text style={styles.clearButtonText}>Clear Cart</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.checkoutButton, isLoading && styles.checkoutButtonDisabled]}
              onPress={handleCheckout}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.checkoutButtonText}>
                {isLoading ? 'Processing...' : 'Proceed to Checkout →'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
