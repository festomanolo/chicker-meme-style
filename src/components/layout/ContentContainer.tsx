import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';
import { theme } from '@/lib/theme';

interface ContentContainerProps extends ScrollViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  showsVerticalScrollIndicator?: boolean;
  bounces?: boolean;
}

export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  bounces = true,
  ...scrollViewProps
}) => {
  return (
    <View style={[styles.container, style]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
