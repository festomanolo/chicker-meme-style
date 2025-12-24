import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from '@/components/ui/Icon';
import { theme } from '@/lib/theme';
import { useCartStore } from '@/lib/cart-store';

interface TabItem {
  name: string;
  icon: string;
  label: string;
}

const tabs: TabItem[] = [
  { name: 'Home', icon: 'home', label: 'Home' },
  { name: 'Discover', icon: 'search', label: 'Discover' },
  { name: 'Cart', icon: 'cart', label: 'Cart' },
  { name: 'Account', icon: 'person', label: 'Account' },
];

export const BottomNav: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { getItemCount } = useCartStore();

  const currentRouteName = route.name;
  const cartItemCount = getItemCount();

  const handleTabPress = (tabName: string) => {
    if (tabName !== currentRouteName) {
      navigation.navigate(tabName as never);
    }
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = currentRouteName === tab.name;
          const isCart = tab.name === 'Cart';
          
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => handleTabPress(tab.name)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Icon
                  name={tab.icon}
                  size={24}
                  color={isActive ? theme.colors.primary : theme.colors.textSecondary}
                />
                {isCart && cartItemCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  { color: isActive ? theme.colors.primary : theme.colors.textSecondary },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  container: {
    height: theme.layout.BOTTOM_NAV_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: theme.spacing.xs,
  },
  label: {
    ...theme.typography.text.caption,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: theme.colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    ...theme.typography.text.caption,
    color: theme.colors.textInverse,
    fontWeight: '600',
    fontSize: 10,
  },
});





