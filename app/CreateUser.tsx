// app/CreateUser.tsx - Wildcard Wallet Authentication Screen
import { useState } from 'react';
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

// Define TypeScript interfaces
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  resetToken: string | null;
  resetTokenExpiry: number | null;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  resetToken: string;
}

type ViewType = 'login' | 'register' | 'forgot' | 'reset';

// Mock user database - in a real app, this would be a backend service
const mockUsers: User[] = [
  {
    id: 1,
    username: 'demo_user',
    email: 'demo@wildcardwallet.com',
    password: 'password123',
    resetToken: null,
    resetTokenExpiry: null,
  },
  {
    id: 2,
    username: 'saver_sarah',
    email: 'sarah@email.com',
    password: 'savings2024',
    resetToken: null,
    resetTokenExpiry: null,
  },
];

export default function CreateUser() {
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    resetToken: '',
  });
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const resetForm = (): void => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      resetToken: '',
    });
  };

  const generateResetToken = (): string => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const handleLogin = (): void => {
    const user = users.find(
      (u) =>
        (u.username === formData.username || u.email === formData.username) &&
        u.password === formData.password
    );

    if (user) {
      setCurrentUser(user);
      Alert.alert(
        'Success! 🎉',
        `Welcome back, ${user.username}! Ready to spin the wheel?`
      );
      resetForm();
      // In a real app, you might navigate to the main app here
      // router.push('/(tabs)/home');
    } else {
      Alert.alert('Login Failed', 'Invalid username/email or password');
    }
  };

  const handleRegister = (): void => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    const existingUser = users.find(
      (u) => u.username === formData.username || u.email === formData.email
    );
    if (existingUser) {
      Alert.alert('Error', 'Username or email already exists');
      return;
    }

    const newUser: User = {
      id: users.length + 1,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      resetToken: null,
      resetTokenExpiry: null,
    };

    setUsers([...users, newUser]);
    Alert.alert(
      'Success! 🎯',
      `Account created for ${formData.username}! Time to start saving with style!`
    );
    setCurrentView('login');
    resetForm();
  };

  const handleForgotPassword = (): void => {
    const user = users.find((u) => u.email === formData.email);
    if (!user) {
      Alert.alert('Error', 'No account found with this email address');
      return;
    }

    const resetToken = generateResetToken();
    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? { ...u, resetToken, resetTokenExpiry: Date.now() + 3600000 } // 1 hour expiry
        : u
    );
    setUsers(updatedUsers);

    // In a real app, you'd send an email here
    Alert.alert(
      'Reset Email Sent! 📧',
      `Password reset instructions have been sent to ${formData.email}\n\n🔧 Demo Token: ${resetToken}\n\n(In a real app, this would be emailed to you)`
    );
    setCurrentView('reset');
  };

  const handlePasswordReset = (): void => {
    const user = users.find(
      (u) =>
        u.resetToken === formData.resetToken &&
        u.resetTokenExpiry &&
        u.resetTokenExpiry > Date.now()
    );

    if (!user) {
      Alert.alert('Error', 'Invalid or expired reset token');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? { ...u, password: formData.password, resetToken: null, resetTokenExpiry: null }
        : u
    );
    setUsers(updatedUsers);

    Alert.alert('Success! 🔐', 'Password has been reset successfully!');
    setCurrentView('login');
    resetForm();
  };

  const handleLogout = (): void => {
    setCurrentUser(null);
    resetForm();
  };

  // Main app screen after successful login
  if (currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <View style={styles.successContainer}>
          <Text style={styles.welcomeTitle}>🎉 Welcome to Wildcard Wallet!</Text>
          <Text style={styles.welcomeSubtitle}>Hello, {currentUser.username}!</Text>

          <View style={styles.featurePreview}>
            <Text style={styles.previewTitle}>🎲 Ready for today's spin?</Text>
            <Text style={styles.previewText}>
              Your next money-saving adventure is just a spin away! Each day brings a
              new fun challenge to boost your savings.
            </Text>

            <View style={styles.ruleExample}>
              <Text style={styles.ruleTitle}>🚶‍♂️ Walkies Wallet</Text>
              <Text style={styles.ruleDesc}>Walk if destination &lt; 1 mile</Text>
              <Text style={styles.ruleSavings}>Estimated savings: $12-18 today</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.spinButton}
            onPress={() => Alert.alert('🎲 Spin Feature', 'This would take you to the daily spin wheel!')}
          >
            <Text style={styles.spinButtonText}>🎲 SPIN TO START SAVING!</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderLoginForm = () => (
    <>
      <Text style={styles.title}>🎲 Wildcard Wallet</Text>
      <Text style={styles.subtitle}>Spin your way to savings!</Text>

      <TextInput
        style={styles.input}
        placeholder="Username or Email"
        value={formData.username}
        onChangeText={(text) => setFormData({ ...formData, username: text })}
        autoCapitalize="none"
        placeholderTextColor="#94a3b8"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
        placeholderTextColor="#94a3b8"
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
        <Text style={styles.primaryButtonText}>Login & Start Spinning! 🎯</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity
          onPress={() => {
            setCurrentView('forgot');
            resetForm();
          }}
        >
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setCurrentView('register');
            resetForm();
          }}
        >
          <Text style={styles.linkText}>Create Account</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.demoInfo}>
        <Text style={styles.demoTitle}>🚀 Try the Demo</Text>
        <Text style={styles.demoText}>Username: demo_user</Text>
        <Text style={styles.demoText}>Password: password123</Text>
      </View>
    </>
  );

  const renderRegisterForm = () => (
    <>
      <Text style={styles.title}>🎯 Join Wildcard Wallet</Text>
      <Text style={styles.subtitle}>Start your savings adventure!</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={formData.username}
        onChangeText={(text) => setFormData({ ...formData, username: text })}
        autoCapitalize="none"
        placeholderTextColor="#94a3b8"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#94a3b8"
      />

      <TextInput
        style={styles.input}
        placeholder="Password (min 6 characters)"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
        placeholderTextColor="#94a3b8"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
        secureTextEntry
        placeholderTextColor="#94a3b8"
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
        <Text style={styles.primaryButtonText}>Create Account 🌟</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setCurrentView('login');
          resetForm();
        }}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </>
  );

  const renderForgotForm = () => (
    <>
      <Text style={styles.title}>🔐 Reset Password</Text>
      <Text style={styles.subtitle}>We'll email you reset instructions</Text>

      <TextInput
        style={styles.input}
        placeholder="Your Email Address"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#94a3b8"
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handleForgotPassword}>
        <Text style={styles.primaryButtonText}>Send Reset Email 📧</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setCurrentView('login');
          resetForm();
        }}
      >
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
    </>
  );

  const renderResetForm = () => (
    <>
      <Text style={styles.title}>🔑 Enter New Password</Text>
      <Text style={styles.subtitle}>Use the token from your email</Text>

      <TextInput
        style={styles.input}
        placeholder="Reset Token from Email"
        value={formData.resetToken}
        onChangeText={(text) => setFormData({ ...formData, resetToken: text })}
        autoCapitalize="none"
        placeholderTextColor="#94a3b8"
      />

      <TextInput
        style={styles.input}
        placeholder="New Password"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
        placeholderTextColor="#94a3b8"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        value={formData.confirmPassword}
        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
        secureTextEntry
        placeholderTextColor="#94a3b8"
      />

      <TouchableOpacity style={styles.primaryButton} onPress={handlePasswordReset}>
        <Text style={styles.primaryButtonText}>Reset Password ✅</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setCurrentView('login');
          resetForm();
        }}
      >
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex1}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formContainer}>
            {currentView === 'login' && renderLoginForm()}
            {currentView === 'register' && renderRegisterForm()}
            {currentView === 'forgot' && renderForgotForm()}
            {currentView === 'reset' && renderResetForm()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  flex1: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#64748b',
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#1e293b',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#3b82f6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  linkText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  demoInfo: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 14,
    color: '#0369a1',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  successContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1e293b',
  },
  welcomeSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    color: '#64748b',
  },
  featurePreview: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#0369a1',
    marginBottom: 16,
    lineHeight: 20,
  },
  ruleExample: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  ruleDesc: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  ruleSavings: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  spinButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  spinButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
