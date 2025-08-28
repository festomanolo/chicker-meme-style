import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

// Simple screen components for testing
const HomeTestScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧭 Navigation Test</Text>
      <Text style={styles.subtitle}>Home Screen</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Details')}
      >
        <Text style={styles.buttonText}>Go to Details</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => Alert.alert('Success!', 'Navigation is working!')}
      >
        <Text style={styles.buttonText}>Test Alert</Text>
      </TouchableOpacity>
      
      <Text style={styles.info}>
        If you can navigate between screens, React Navigation works!
      </Text>
    </View>
  );
};

const DetailsTestScreen = ({ navigation }: any) => {
  return (
    <View style={[styles.container, { backgroundColor: '#9C27B0' }]}>
      <Text style={styles.title}>📄 Details Screen</Text>
      <Text style={styles.subtitle}>Navigation successful!</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
      
      <Text style={styles.info}>
        Navigation between screens is working correctly!
      </Text>
    </View>
  );
};

const NavigationTest = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeTestScreen} />
        <Stack.Screen name="Details" component={DetailsTestScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
