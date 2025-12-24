import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Icon } from '@/components/ui/Icon';
import { FixedHeader } from '@/components/layout/FixedHeader';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { theme } from '@/lib/theme';
import { useAuthStore } from '@/lib/auth-store';
import { useNavigation } from '@react-navigation/native';

export const AccountScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const menuItems = [
    {
      id: 'orders',
      title: 'My Orders',
      icon: 'receipt-outline',
      onPress: () => navigation.navigate('Orders' as never),
    },
    {
      id: 'profile',
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: () => Alert.alert('Coming Soon', 'Profile editing will be available soon!'),
    },
    {
      id: 'settings',
