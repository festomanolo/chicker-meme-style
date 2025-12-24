import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Product {
  id: string;
  title: string;
  price: number;
  emoji: string;
  description: string;
  category: string;
}

const products: Product[] = [
  {
    id: '1',
    title: 'Dank Meme Tee',
    price: 29.99,
    emoji: '🔥',
    description: 'The most fire meme you\'ve ever seen',
    category: 'viral',
  },
  {
    id: '2',
    title: 'Viral Sensation',
    price: 34.99,
    emoji: '🚀',
    description: 'Break the internet with this one',
    category: 'trending',
  },
  {
    id: '3',
    title: 'Epic Fail Collection',
    price: 27.99,
    emoji: '😂',
    description: 'Because we all need a good laugh',
    category: 'funny',
  },
  {
    id: '4',
    title: 'Legendary Status',
    price: 39.99,
    emoji: '👑',
    description: 'Achievement unlocked: Style Master',
    category: 'gaming',
  },
];

