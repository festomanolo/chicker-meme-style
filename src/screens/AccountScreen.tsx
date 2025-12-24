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
      title: 'Settings',
      icon: 'settings-outline',
      onPress: () => Alert.alert('Coming Soon', 'Settings will be available soon!'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => Alert.alert('Help', 'Contact us at support@chicker.com'),
    },
    {
      id: 'about',
      title: 'About Chicker',
      icon: 'information-circle-outline',
      onPress: () => Alert.alert('About', 'Chicker - The ultimate meme tee destination!'),
    },
  ];

  return (
    <View style={styles.container}>
      <FixedHeader title="Account" showCart={false} />
      <ContentContainer>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Icon name="person" size={48} color={theme.colors.primary} />
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Icon name={item.icon as any} size={24} color={theme.colors.text} />
                <Text style={styles.menuItemTitle}>{item.title}</Text>
              </View>
              <Icon name="arrow-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Icon name="logout" size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ContentContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  userName: {
    ...theme.typography.text.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    ...theme.typography.text.body,
    color: theme.colors.textSecondary,
  },
  menuSection: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.layout.CARD_RADIUS,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    ...theme.typography.text.body,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.layout.BUTTON_RADIUS,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  logoutText: {
    ...theme.typography.text.button,
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
  },
});





