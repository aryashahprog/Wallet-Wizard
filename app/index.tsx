// app/index.tsx - WELCOME & AUTHENTICATION SCREEN
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

export default function WelcomeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Helper function for cross-platform alerts
  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}\n\n${message}`);
    } else {
      showAlert(title, message);
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Check login status when screen comes into focus (e.g., after logout)
  useEffect(() => {
    const unsubscribe = () => {
      checkLoginStatus();
    };
    
    // Check login status periodically to catch logout
    const interval = setInterval(checkLoginStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        setIsLoggedIn(true);
        // Auto-navigate to main app if already logged in
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1000);
      } else {
        // User is not logged in, reset state
        setIsLoggedIn(false);
        setShowLogin(false);
        setShowRegister(false);
      }
    } catch (error) {
      console.log('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  const handleLogin = async () => {
    console.log('Login attempt:', { username: formData.username, password: formData.password ? '***' : 'empty' });
    
    if (!formData.username || !formData.password) {
      showAlert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Get stored users
      const usersData = await AsyncStorage.getItem('users');
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      console.log('Stored users:', users.length);
      
      // Find user
      const user = users.find(u => 
        (u.username === formData.username || u.email === formData.username) &&
        u.password === formData.password
      );
      console.log('Found user:', user ? 'Yes' : 'No');

      if (user) {
        // Save current user
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        setIsLoggedIn(true);
        
        showAlert('Welcome Back! 🎉', `Ready to save money, ${user.username}?`);
        
        // Navigate to main app
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 1500);
      } else {
        showAlert('Login Failed', 'Invalid username/email or password');
      }
    } catch (error) {
      showAlert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleRegister = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      showAlert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showAlert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      showAlert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      // Get existing users
      const usersData = await AsyncStorage.getItem('users');
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      
      // Check if user already exists
      const existingUser = users.find(u => 
        u.username === formData.username || u.email === formData.email
      );

      if (existingUser) {
        showAlert('Error', 'Username or email already exists');
        return;
      }

      // Create new user
      const newUser: User = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));

      // Initialize user stats
      const initialStats = {
        totalPoints: 0,
        totalSavings: 0,
        challengesCompleted: 0,
        currentStreak: 0,
        completedToday: false,
        joinDate: new Date().toISOString()
      };
      await AsyncStorage.setItem('userStats', JSON.stringify(initialStats));

      setIsLoggedIn(true);
             showAlert('Welcome to Wallet Wizard! 🎉', `Let's start saving money, ${newUser.username}!`);
      
      // Navigate to main app
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1500);
    } catch (error) {
      showAlert('Error', 'Something went wrong. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setShowLogin(false);
    setShowRegister(false);
  };

  const createDemoUser = async () => {
    try {
      const demoUser: User = {
        id: Date.now(),
        username: 'demo',
        email: 'demo@example.com',
        password: 'demo123'
      };

      // Get existing users
      const usersData = await AsyncStorage.getItem('users');
      const users: User[] = usersData ? JSON.parse(usersData) : [];
      
      // Check if demo user already exists
      const existingDemo = users.find(u => u.username === 'demo');
      if (!existingDemo) {
        users.push(demoUser);
        await AsyncStorage.setItem('users', JSON.stringify(users));
      }

      // Auto-fill form with demo credentials
      setFormData({
        username: 'demo',
        email: 'demo@example.com',
        password: 'demo123',
        confirmPassword: 'demo123'
      });
      
      showAlert('Demo User Created! 🎉', 'Demo credentials: username: demo, password: demo123');
    } catch (error) {
      showAlert('Error', 'Failed to create demo user');
    }
  };

  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎲 Wallet Wizard</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>
        <Text style={styles.status}>Redirecting to your dashboard...</Text>
      </View>
    );
  }

  if (showLogin) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎲 Wallet Wizard</Text>
        <Text style={styles.subtitle}>Welcome Back!</Text>
        
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username or Email"
            value={formData.username}
            onChangeText={(text) => setFormData({...formData, username: text})}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({...formData, password: text})}
            secureTextEntry
          />
          
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkButton} onPress={resetForm}>
            <Text style={styles.linkText}>← Back to Welcome</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (showRegister) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎲 Wallet Wizard</Text>
        <Text style={styles.subtitle}>Join the Savings Revolution!</Text>
        
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={formData.username}
            onChangeText={(text) => setFormData({...formData, username: text})}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({...formData, password: text})}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
            secureTextEntry
          />
          
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkButton} onPress={resetForm}>
            <Text style={styles.linkText}>← Back to Welcome</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎲 Wallet Wizard</Text>
      <Text style={styles.subtitle}>Turn saving money into a game!</Text>
      <Text style={styles.description}>
        Spin the wheel, complete challenges, and watch your savings grow! 
        Join thousands of users who've saved over $1M+ through fun daily challenges.
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={() => setShowLogin(true)}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={() => setShowRegister(true)}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
      
        <TouchableOpacity style={styles.demoButton} onPress={createDemoUser}>
          <Text style={styles.demoText}>Create Demo User</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.demoButton, { marginTop: 10 }]} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.demoText}>Try Demo (No Login Required)</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
    maxWidth: 300,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  registerButton: {
    backgroundColor: '#10b981',
  },
  demoButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#64748b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  linkButton: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  demoText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 14,
    textAlign: 'center',
  },
  status: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
});