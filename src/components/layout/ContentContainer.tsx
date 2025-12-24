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
        bounces={bounces}
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: theme.layout.HEADER_HEIGHT - theme.layout.CONTENT_OVERLAP,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.layout.BORDER_RADIUS,
    borderTopRightRadius: theme.layout.BORDER_RADIUS,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: theme.layout.CONTENT_PADDING_TOP,
    paddingBottom: theme.layout.BOTTOM_NAV_HEIGHT + theme.layout.CONTENT_PADDING_BOTTOM,
    minHeight: '100%',
    overflow: 'hidden',
  },
});





