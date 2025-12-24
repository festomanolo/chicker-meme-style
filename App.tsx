import React, { useEffect, useState } from 'react';
import { StatusBar, View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Progressive test components
import AsyncStorageTest from './AsyncStorageTest';
import NavigationTest from './NavigationTest';

// Screens
import { SplashScreen } from './src/screens/SplashScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { DiscoverScreen } from './src/screens/DiscoverScreen';
import { CartScreen } from './src/screens/CartScreen';
import { AccountScreen } from './src/screens/AccountScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { CheckoutScreen } from './src/screens/CheckoutScreen';
import { OrdersScreen } from './src/screens/OrdersScreen';

// Theme
import { theme } from './src/lib/theme';

const Stack = createStackNavigator();

// Simple test component to verify React Native works
const TestComponent = () => {
  const [testState, setTestState] = useState('Initial');
  
  const handleTest = () => {
    setTestState('Button Pressed!');
    Alert.alert('Success!', 'React Native is working correctly!');
  };

  return (
    <View style={styles.testContainer}>
      <Text style={styles.testTitle}>🐔 Chicker Debug</Text>
      <Text style={styles.testSubtitle}>Progressive Testing Mode</Text>
      
      <TouchableOpacity style={styles.testButton} onPress={handleTest}>
        <Text style={styles.testButtonText}>Test React Native</Text>
      </TouchableOpacity>
      
