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
      
      <Text style={styles.testStatus}>Status: {testState}</Text>
      <Text style={styles.testInfo}>If you see this, basic React Native works!</Text>
    </View>
  );
};

// Progressive testing levels
const TEST_LEVELS = {
  BASIC: 'basic',           // Just React Native components
  ASYNC_STORAGE: 'storage', // Add AsyncStorage
  NAVIGATION: 'navigation', // Add React Navigation
  FULL: 'full'             // Full app
};

// Main App Component
export default function App() {
  // Change this to progress through test levels
  const [currentTestLevel] = useState(TEST_LEVELS.FULL); // Change to test different levels
  const [testResults, setTestResults] = useState({});

  // Basic React Native test
  if (currentTestLevel === TEST_LEVELS.BASIC) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <TestComponent />
      </View>
    );
  }

  // AsyncStorage test
  if (currentTestLevel === TEST_LEVELS.ASYNC_STORAGE) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <AsyncStorageTest />
      </View>
    );
  }

  // Navigation test
  if (currentTestLevel === TEST_LEVELS.NAVIGATION) {
    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <NavigationTest />
      </>
    );
  }

  // Full app (final step)
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Discover" component={DiscoverScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  testContainer: {
    flex: 1,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  testTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  testSubtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 40,
    opacity: 0.9,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  testButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
  },
  testStatus: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  testInfo: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
});





