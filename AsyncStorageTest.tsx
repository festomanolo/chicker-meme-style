import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageTest = () => {
  const [storageStatus, setStorageStatus] = useState('Testing...');
  const [testValue, setTestValue] = useState('');

  useEffect(() => {
    testAsyncStorage();
  }, []);

  const testAsyncStorage = async () => {
    try {
      console.log('Testing AsyncStorage...');
      
      // Test write
      await AsyncStorage.setItem('test_key', 'test_value');
      console.log('AsyncStorage write successful');
      
      // Test read
      const value = await AsyncStorage.getItem('test_key');
      console.log('AsyncStorage read successful:', value);
      
      if (value === 'test_value') {
        setStorageStatus('✅ AsyncStorage Working');
        setTestValue(value);
      } else {
        setStorageStatus('❌ AsyncStorage Read Failed');
      }
    } catch (error) {
      console.error('AsyncStorage test failed:', error);
      setStorageStatus('❌ AsyncStorage Failed: ' + error.message);
    }
  };

  const handleAdvancedTest = async () => {
    try {
      // Test multiple operations
      await AsyncStorage.multiSet([
        ['key1', 'value1'],
        ['key2', 'value2'],
        ['key3', 'value3']
      ]);
      
      const values = await AsyncStorage.multiGet(['key1', 'key2', 'key3']);
      console.log('Multi-get result:', values);
      
      Alert.alert('Success!', 'Advanced AsyncStorage test passed!');
    } catch (error) {
      Alert.alert('Error', 'Advanced test failed: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗄️ AsyncStorage Test</Text>
      <Text style={styles.subtitle}>Testing data persistence</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.status}>{storageStatus}</Text>
        {testValue && (
          <Text style={styles.value}>Stored Value: {testValue}</Text>
        )}
      </View>
      
      <TouchableOpacity style={styles.button} onPress={testAsyncStorage}>
        <Text style={styles.buttonText}>Retest AsyncStorage</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={handleAdvancedTest}>
        <Text style={styles.buttonText}>Advanced Test</Text>
      </TouchableOpacity>
      
      <Text style={styles.info}>
        If this works, we can proceed to navigation testing
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
