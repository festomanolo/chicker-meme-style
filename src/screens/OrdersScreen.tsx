import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@/components/ui/Icon';
import { FixedHeader } from '@/components/layout/FixedHeader';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { theme } from '@/lib/theme';
import { useAuthStore } from '@/lib/auth-store';
import { db } from '@/lib/database';

interface Order {
  id: string;
  user_id: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  total: number;
  status: 'paid' | 'printing' | 'shipped' | 'delivered';
  date: string;
  tracking?: string;
  estimatedDelivery?: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
  created_at: number;
}

const statusConfig = {
  paid: { label: 'Paid', color: theme.colors.success, icon: 'checkmark' },
  printing: { label: 'Printing', color: theme.colors.warning, icon: 'time' },
  shipped: { label: 'Shipped', color: theme.colors.primary, icon: 'arrow-forward' },
  delivered: { label: 'Delivered', color: theme.colors.success, icon: 'success' },
};

export const OrdersScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const userOrders = await db.getOrdersForUser(user.id);
      setOrders(userOrders || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      paid: 0,
      printing: 0,
      shipped: 0,
      delivered: 0,
    };
    
    orders.forEach(order => {
      counts[order.status]++;
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  const renderOrderItem = (order: Order) => {
    const statusInfo = statusConfig[order.status];
    
    return (
      <View key={order.id} style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
