import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '@/lib/theme';
import { useAuthStore } from '@/lib/auth-store';
import { initDatabase } from '@/lib/database';

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation();
  const { checkAuth } = useAuthStore();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    initializeApp();
    startAnimations();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const initializeApp = async () => {
    try {
      // Initialize database
      await initDatabase();
      
      // Check authentication status
      await checkAuth();
      
      // Wait for animations to complete
      setTimeout(() => {
        navigation.navigate('Home' as never);
      }, 2000);
    } catch (error) {
      console.error('App initialization failed:', error);
      // Still navigate to home even if initialization fails
      setTimeout(() => {
        navigation.navigate('Home' as never);
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🐔</Text>
          <Text style={styles.logoText}>Chicker</Text>
        </View>
        
        <Text style={styles.tagline}>
          Where Memes Meet Fashion
        </Text>
        
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDot} />
          <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
          <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
