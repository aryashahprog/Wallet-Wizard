// app/state/store.ts - Enhanced Zustand Store with Backend Integration
import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';

export type Rule = { 
  id: string; 
  name: string; 
  params?: Record<string, any>; 
  emoji: string; 
  activeForDate?: string;
  points?: number;
  difficulty?: string;
  category?: string;
  estimatedSavings?: { min: number; max: number };
};

export type Reminder = { date: string; message: string };
export type SimResult = { 
  todaySavingsEstimate: number; 
  overdraftProb?: number | null;
  pointsReward?: number;
  difficultyMultiplier?: number;
};
export type Streak = { days: number; lastAcceptedDate: string | null };

export type UserStats = {
  totalPoints: number;
  totalSavings: number;
  challengesCompleted: number;
  currentStreak: number;
  completedToday: boolean;
  level: number;
  badges: string[];
};

type DiffBuffer = {
  rule?: Rule;
  sim?: SimResult;
  reminder?: Reminder;
};

type SpinSession = {
  sessionId: string;
  challengeId: string;
  status: 'proposed' | 'accepted' | 'completed' | 'rejected';
  proposedAt: string;
  acceptedAt?: string;
  completedAt?: string;
  estimatedSavings: number;
  actualSavings?: number;
  pointsEarned?: number;
};

type State = {
  // Core state
  rules: Rule[];
  reminders: Reminder[];
  simResult: SimResult | null;
  streak: Streak;
  diff: DiffBuffer | null;

  // User data
  currentUser: { id: string; username: string; email: string } | null;
  userStats: UserStats;
  currentSession: SpinSession | null;

  // Leaderboard data
  leaderboardData: any[];
  friends: any[];

  // UI state
  isLoading: boolean;
  lastSyncAt: string | null;

  // Cedar-style typed setters
  addRule: (r: Rule) => void;
  addReminder: (r: Reminder) => void;
  setSimResult: (s: SimResult) => void;
  incrementStreak: (todayISO: string) => void;

  // User management
  setCurrentUser: (user: { id: string; username: string; email: string } | null) => void;
  updateUserStats: (stats: Partial<UserStats>) => void;
  setCurrentSession: (session: SpinSession | null) => void;

  // Leaderboard management
  setLeaderboardData: (data: any[]) => void;
  setFriends: (friends: any[]) => void;
  loadLeaderboard: (type?: 'global' | 'friends') => Promise<void>;

  // Diff controls
  setDiff: (d: DiffBuffer | null) => void;
  acceptDiff: (todayISO: string) => void;
  rejectDiff: () => void;

  // Backend integration methods
  syncWithBackend: () => Promise<void>;
  loadUserData: (userId: string) => Promise<void>;
  saveUserData: () => Promise<void>;

  // Utility methods
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

const initialUserStats: UserStats = {
  totalPoints: 0,
  totalSavings: 0,
  challengesCompleted: 0,
  currentStreak: 0,
  completedToday: false,
  level: 1,
  badges: []
};

export const useAppStore = create<State>()(
  persist(
    (set, get) => ({
      // Initial state
      rules: [],
      reminders: [],
      simResult: null,
      streak: { days: 0, lastAcceptedDate: null },
      diff: null,
      currentUser: null,
      userStats: initialUserStats,
      currentSession: null,
      leaderboardData: [],
      friends: [],
      isLoading: false,
      lastSyncAt: null,

      // Basic setters
      addRule: (r) => set((s) => ({ rules: [r, ...s.rules] })),
      addReminder: (r) => set((s) => ({ reminders: [r, ...s.reminders] })),
      setSimResult: (sim) => set({ simResult: sim }),
      incrementStreak: (todayISO) =>
        set((s) =>
          s.streak.lastAcceptedDate === todayISO
            ? s
            : { streak: { days: s.streak.days + 1, lastAcceptedDate: todayISO } }
        ),

      // User management
      setCurrentUser: (user) => set({ currentUser: user }),
      updateUserStats: (stats) => 
        set((s) => ({ 
          userStats: { ...s.userStats, ...stats },
          lastSyncAt: new Date().toISOString()
        })),
      setCurrentSession: (session) => set({ currentSession: session }),

      // Leaderboard management
      setLeaderboardData: (data) => set({ leaderboardData: data }),
      setFriends: (friends) => set({ friends }),
      loadLeaderboard: async (type = 'global') => {
        try {
          set({ isLoading: true });
          
          // In production, you'd fetch from your backend:
          // const response = await fetch(`/api/leaderboard?type=${type}`);
          // const data = await response.json();
          
          // For demo purposes, use mock data
          const mockLeaderboardData = [
            {
              rank: 1,
              user: {
                id: '1',
                username: 'SavingsStar',
                points: 2450,
                totalSavings: 1250.75,
                streak: 28,
                avatar: '🌟',
                level: 8
              },
              score: 2450,
              change: 2
            },
            {
              rank: 2,
              user: {
                id: '2',
                username: 'BudgetBoss',
                points: 2380,
                totalSavings: 1180.50,
                streak: 25,
                avatar: '👑',
                level: 7
              },
              score: 2380,
              change: -1
            },
            // Add current user to leaderboard
            {
              rank: 4,
              user: {
                id: get().currentUser?.id || 'demo_user',
                username: get().currentUser?.username || 'demo_user',
                points: get().userStats.totalPoints,
                totalSavings: get().userStats.totalSavings,
                streak: get().userStats.currentStreak,
                avatar: '🎯',
                level: get().userStats.level
              },
              score: get().userStats.totalPoints,
              change: 0
            }
          ];

          set({ leaderboardData: mockLeaderboardData });
        } catch (error) {
          console.error('Error loading leaderboard:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Diff management
      setDiff: (d) => set({ diff: d }),
      acceptDiff: (todayISO) => {
        const d = get().diff;
        if (!d) return;
        
        const state = get();
        
        if (d.rule) state.addRule({ ...d.rule, activeForDate: todayISO });
        if (d.reminder) state.addReminder(d.reminder);
        if (d.sim) state.setSimResult(d.sim);
        
        state.incrementStreak(todayISO);
        set({ diff: null });
      },
      rejectDiff: () => set({ diff: null }),

      // Backend integration
      syncWithBackend: async () => {
        const state = get();
        if (!state.currentUser?.id) return;

        try {
          set({ isLoading: true });
          
          // Load latest user stats
          const response = await fetch(`/api/customers?id=${state.currentUser.id}&includeWalletWizard=true`);
          if (response.ok) {
            const data = await response.json();
            if (data.walletWizard) {
              state.updateUserStats(data.walletWizard);
            }
          }

          // Load current session if any
          const sessionResponse = await fetch(`/api/spin?customerId=${state.currentUser.id}&action=today`);
          if (sessionResponse.ok) {
            const sessionData = await sessionResponse.json();
            if (sessionData.session) {
              state.setCurrentSession(sessionData.session);
            }
          }

          set({ lastSyncAt: new Date().toISOString() });
        } catch (error) {
          console.error('Sync error:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      loadUserData: async (userId: string) => {
        try {
          set({ isLoading: true });

          // Load user profile
          const userResponse = await fetch(`/api/customers?id=${userId}&includeWalletWizard=true`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            
            if (userData.walletWizard) {
              set({ 
                userStats: userData.walletWizard,
                currentUser: {
                  id: userId,
                  username: userData.walletWizard.displayName || userData.first_name || 'User',
                  email: userData.email || ''
                }
              });
            }
          }

          // Load spin history and stats
          const statsResponse = await fetch(`/api/spin?customerId=${userId}&action=stats`);
          if (statsResponse.ok) {
            const stats = await statsResponse.json();
            get().updateUserStats({
              totalPoints: stats.totalPointsEarned,
              totalSavings: stats.totalSavings,
              challengesCompleted: stats.completedChallenges,
              currentStreak: stats.currentStreak
            });
          }

          // Check today's challenge
          const todayResponse = await fetch(`/api/spin?customerId=${userId}&action=today`);
          if (todayResponse.ok) {
            const todayData = await todayResponse.json();
            if (todayData.session) {
              get().setCurrentSession(todayData.session);
            }
          }

          set({ lastSyncAt: new Date().toISOString() });
        } catch (error) {
          console.error('Error loading user data:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      saveUserData: async () => {
        const state = get();
        if (!state.currentUser?.id) return;

        try {
          const response = await fetch('/api/customers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'updateWalletWizardStats',
              customerId: state.currentUser.id,
              data: state.userStats
            })
          });

          if (response.ok) {
            set({ lastSyncAt: new Date().toISOString() });
          }
        } catch (error) {
          console.error('Error saving user data:', error);
        }
      },

      // Utility methods
      setLoading: (loading) => set({ isLoading: loading }),
      reset: () => set({
        rules: [],
        reminders: [],
        simResult: null,
        streak: { days: 0, lastAcceptedDate: null },
        diff: null,
        currentUser: null,
        userStats: initialUserStats,
        currentSession: null,
        isLoading: false,
        lastSyncAt: null
      })
    }),
    {
      name: 'wallet-wizard-storage',
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          // In React Native, you'd use AsyncStorage here
          // For web compatibility, using localStorage
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              return window.localStorage.getItem(name);
            } catch (error) {
              console.warn('localStorage getItem failed:', error);
              return null;
            }
          }
          return null;
        },
        setItem: async (name: string, value: string) => {
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              window.localStorage.setItem(name, value);
            } catch (error) {
              console.warn('localStorage setItem failed:', error);
            }
          }
        },
        removeItem: async (name: string) => {
          if (typeof window !== 'undefined' && window.localStorage) {
            try {
              window.localStorage.removeItem(name);
            } catch (error) {
              console.warn('localStorage removeItem failed:', error);
            }
          }
        },
      })),
      partialize: (state) => ({
        currentUser: state.currentUser,
        userStats: state.userStats,
        streak: state.streak,
        rules: state.rules.slice(0, 10), // Only persist recent rules
        lastSyncAt: state.lastSyncAt
      })
    }
  )
);

// Default export to satisfy Expo Router (this file shouldn't be a route)
export default function StoreFile() {
  return null;
}