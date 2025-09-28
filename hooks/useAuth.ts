// hooks/useAuth.ts - Authentication Hook for Wallet Wizard
import { useAppStore } from '@/store';
import { LoginCredentials, RegisterData, User } from '@/wildcard-wallet/types';
import React from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

export function useAuth() {
  const [authState, setAuthState] = (React as any).useState({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null
  });

  const { 
    currentUser, 
    setCurrentUser, 
    loadUserData, 
    reset,
    syncWithBackend 
  } = useAppStore();

  (React as any).useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (currentUser?.id) {
        // Verify user still exists and load fresh data
        await loadUserData(currentUser.id);
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: currentUser,
          error: null
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: 'Authentication failed'
      });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    setAuthState((prev: AuthState) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Mock authentication logic - replace with actual backend call
      const mockUsers = [
        { username: 'demo_user', password: 'password123', customerId: 'demo_customer_id' },
        { username: 'saver_sarah', password: 'savings2024', customerId: 'sarah_customer_id' }
      ];

      const mockUser = mockUsers.find(u => 
        (u.username === credentials.username || 
         `${u.username}@walletwizard.com` === credentials.username) &&
        u.password === credentials.password
      );

      if (!mockUser) {
        throw new Error('Invalid username or password');
      }

      // Create user object
      const user: User = {
        id: mockUser.customerId,
        username: mockUser.username,
        email: credentials.username.includes('@') ? credentials.username : `${mockUser.username}@walletwizard.com`,
        nessieCustomerId: mockUser.customerId
      };

      // Set user in store and load their data
      setCurrentUser(user);
      await loadUserData(user.id);

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user,
        error: null
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResult> => {
    setAuthState((prev: AuthState) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Validate passwords match
      if (userData.password !== userData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Check if user already exists (mock check)
      const existingUsers = ['demo_user', 'saver_sarah'];
      if (existingUsers.includes(userData.username)) {
        throw new Error('Username already exists');
      }

      // In a real app, this would create a user via your backend
      try {
        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'createCustomer',
            data: {
              nessieData: {
                first_name: userData.username.split('_')[0] || 'User',
                last_name: userData.username.split('_')[1] || 'Name',
                address: {
                  street_number: '123',
                  street_name: 'Main St',
                  city: 'Anytown',
                  state: 'CA',
                  zip: '12345'
                }
              },
              authData: {
                username: userData.username,
                email: userData.email,
                password: userData.password
              }
            }
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create account');
        }

        const result = await response.json();
        
        if (result.success && result.customer) {
          // Login the newly created user
          return await login({
            username: userData.username,
            password: userData.password
          });
        } else {
          throw new Error(result.error || 'Registration failed');
        }
      } catch (fetchError) {
        // Fallback to mock registration for demo
        const newUser: User = {
          id: `user_${Date.now()}`,
          username: userData.username,
          email: userData.email,
          nessieCustomerId: `nessie_${Date.now()}`
        };

        setCurrentUser(newUser);
        await loadUserData(newUser.id);

        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: newUser,
          error: null
        });

        return { success: true, user: newUser };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState((prev: AuthState) => ({ ...prev, isLoading: false, error: errorMessage }));
      return { success: false, error: errorMessage };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // In a real app, you might call a logout endpoint
      // await apiClient.logout();
      
      reset();
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      reset();
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null
      });
    }
  };

  const forgotPassword = async (email: string): Promise<AuthResult> => {
    try {
      // Mock password reset logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // In a real app, this would trigger an email
      const resetToken = Math.random().toString(36).substring(2, 15);
      
      return { 
        success: true, 
        error: `Reset email sent to ${email}. Demo token: ${resetToken}` 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      return { success: false, error: errorMessage };
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<AuthResult> => {
    try {
      // Mock password reset verification
      if (token.length < 10) {
        throw new Error('Invalid reset token');
      }

      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      return { success: false, error: errorMessage };
    }
  };

  const refresh = async (): Promise<void> => {
    if (currentUser?.id) {
      try {
        await syncWithBackend();
      } catch (error) {
        console.error('Refresh failed:', error);
      }
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<AuthResult> => {
    if (!currentUser?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      // Update user profile via API
      const response = await fetch('/api/customers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: currentUser.id,
          nessieData: updates,
        })
      });

      if (response.ok) {
        const updatedUser = { ...currentUser, ...updates };
        setCurrentUser(updatedUser);
        setAuthState((prev: AuthState) => ({ ...prev, user: updatedUser }));
        return { success: true, user: updatedUser };
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      return { success: false, error: errorMessage };
    }
  };

  const deleteAccount = async (): Promise<AuthResult> => {
    if (!currentUser?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      // Delete all user data
      await fetch(`/api/spin?customerId=${currentUser.id}`, {
        method: 'DELETE'
      });

      await logout();
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Account deletion failed';
      return { success: false, error: errorMessage };
    }
  };

  return {
    // State
    ...authState,
    
    // Actions
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    refresh,
    updateProfile,
    deleteAccount,
    
    // Utilities
    checkAuthStatus,
    
    // Derived state
    isLoggedIn: authState.isAuthenticated && !!authState.user,
    userId: authState.user?.id || null,
    username: authState.user?.username || null,
  };
}