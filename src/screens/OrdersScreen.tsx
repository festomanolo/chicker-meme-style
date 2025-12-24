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
            <Text style={styles.orderId}>Order #{order.id}</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
          </View>
          <View style={styles.statusContainer}>
            <Icon name={statusInfo.icon} size={16} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.label}
            </Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          {order.items.slice(0, 2).map((item, index) => (
            <Text key={index} style={styles.itemText}>
              {item.quantity}x {item.name}
            </Text>
          ))}
          {order.items.length > 2 && (
            <Text style={styles.moreItems}>
              +{order.items.length - 2} more items
            </Text>
          )}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
          {order.tracking && (
            <Text style={styles.trackingText}>
              Tracking: {order.tracking}
            </Text>
          )}
        </View>

        {order.estimatedDelivery && (
          <Text style={styles.deliveryText}>
            Estimated delivery: {order.estimatedDelivery}
          </Text>
        )}
      </View>
    );
  };

  const tabs = [
    { key: 'all', label: 'All', count: statusCounts.all },
    { key: 'paid', label: 'Paid', count: statusCounts.paid },
    { key: 'printing', label: 'Printing', count: statusCounts.printing },
    { key: 'shipped', label: 'Shipped', count: statusCounts.shipped },
    { key: 'delivered', label: 'Delivered', count: statusCounts.delivered },
  ];

  return (
    <View style={styles.container}>
      <FixedHeader title="My Orders" />
