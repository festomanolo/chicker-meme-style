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
      <ContentContainer>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={18} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search orders..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={theme.colors.textSecondary}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close" size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Status Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
          <View style={styles.tabs}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  activeTab === tab.key && styles.activeTab,
                ]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.key && styles.activeTabText,
                  ]}
                >
                  {tab.label}
                </Text>
                {tab.count > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{tab.count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Orders List */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.ordersList}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading orders...</Text>
            </View>
          ) : filteredOrders.length > 0 ? (
            <View style={styles.ordersContainer}>
              {filteredOrders.map(renderOrderItem)}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="receipt-outline" size={64} color={theme.colors.textSecondary} />
              <Text style={styles.emptyTitle}>No orders found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery ? "Try adjusting your search terms" : "You haven't placed any orders yet"}
              </Text>
              <TouchableOpacity
                style={styles.shopButton}
                onPress={() => navigation.navigate('Home' as never)}
                activeOpacity={0.8}
              >
                <Text style={styles.shopButtonText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </ContentContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.layout.BUTTON_RADIUS,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
