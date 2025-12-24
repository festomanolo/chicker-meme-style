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
      
