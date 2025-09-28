// types/index.ts - Shared TypeScript Types for Wallet Wizard

// User & Authentication Types
export interface User {
    id: string;
    username: string;
    email: string;
    nessieCustomerId?: string;
    createdAt?: string;
    lastLoginAt?: string;
  }
  
  export interface AuthData {
    username: string;
    email: string;
    password: string;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface RegisterData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  // Wallet Wizard Game Types
  export interface WalletWizardUserStats {
    totalPoints: number;
    totalSavings: number;
    challengesCompleted: number;
    currentStreak: number;
    completedToday: boolean;
    level: number;
    badges: string[];
    lastChallengeDate: string;
    lastUpdated?: string;
  }
  
  export interface Challenge {
    id: string;
    name: string;
    emoji: string;
    description: string;
    estimatedSavings: { min: number; max: number };
    points: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    activeForDate?: string;
    params?: Record<string, any>;
  }
  
  // Spin Session Management
  export interface SpinSession {
    sessionId: string;
    customerId: string;
    challengeId: string;
    status: 'proposed' | 'accepted' | 'completed' | 'rejected';
    proposedAt: string;
    acceptedAt?: string;
    completedAt?: string;
    estimatedSavings: number;
    actualSavings?: number;
    pointsEarned?: number;
  }
  
  // Cedar-Style State Management
  export interface Rule {
    id: string;
    name: string;
    params?: Record<string, any>;
    emoji: string;
    activeForDate?: string;
    points?: number;
    difficulty?: string;
    category?: string;
    estimatedSavings?: { min: number; max: number };
  }
  
  export interface Reminder {
    date: string;
    message: string;
    id?: string;
    isCompleted?: boolean;
  }
  
  export interface SimResult {
    todaySavingsEstimate: number;
    overdraftProb?: number | null;
    pointsReward?: number;
    difficultyMultiplier?: number;
    riskLevel?: 'low' | 'medium' | 'high';
  }
  
  export interface Streak {
    days: number;
    lastAcceptedDate: string | null;
    longestStreak?: number;
    currentWeekCompleted?: number;
  }
  
  export interface DiffBuffer {
    rule?: Rule;
    sim?: SimResult;
    reminder?: Reminder;
    metadata?: {
      proposedAt: string;
      expiresAt?: string;
      source: 'ai' | 'manual' | 'preset';
    };
  }
  
  // Nessie API Types
  export interface NessieCustomer {
    _id: string;
    first_name: string;
    last_name: string;
    address: {
      street_number: string;
      street_name: string;
      city: string;
      state: string;
      zip: string;
    };
    email?: string;
    phone?: string;
  }
  
  export interface NessieAccount {
    _id: string;
    type: string;
    nickname: string;
    rewards: number;
    balance: number;
    customer_id: string;
  }
  
  // API Response Types
  export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp?: string;
  }
  
  export interface CustomerApiResponse extends ApiResponse {
    customer?: NessieCustomer & {
      walletWizard?: WalletWizardUserStats;
    };
    stats?: WalletWizardUserStats;
    newBadges?: string[];
  }
  
  export interface SpinApiResponse extends ApiResponse {
    session?: SpinSession;
    sessions?: SpinSession[];
    stats?: {
      totalSpins: number;
      completedChallenges: number;
      acceptanceRate: number;
      completionRate: number;
      currentStreak: number;
      totalPointsEarned: number;
      totalSavings: number;
    };
    hasSpunToday?: boolean;
    canSpin?: boolean;
  }
  
  export interface ProposeRuleApiResponse extends ApiResponse {
    actions: Action[];
    diffMode: string;
    metadata?: {
      ruleId: string;
      difficulty: string;
      category: string;
      isPersonalized: boolean;
      confidenceScore: number;
    };
    rules?: Challenge[];
    categories?: string[];
    difficulties?: string[];
  }
  
  // Cedar Action Types
  export interface Action {
    type: 'setState' | 'frontendTool' | 'api';
    stateKey?: string;
    setterKey?: string;
    args?: any;
    toolName?: string;
    endpoint?: string;
    method?: string;
  }
  
  // UI State Types
  export interface LoadingState {
    isLoading: boolean;
    loadingMessage?: string;
    progress?: number;
  }
  
  export interface ErrorState {
    hasError: boolean;
    errorMessage?: string;
    errorCode?: string;
    canRetry?: boolean;
  }
  
  // Form Types
  export interface FormState<T> {
    data: T;
    errors: Partial<Record<keyof T, string>>;
    isValid: boolean;
    isDirty: boolean;
    isSubmitting: boolean;
  }
  
  // Navigation Types
  export type ViewType = 'login' | 'register' | 'forgot' | 'reset';
  
  export interface NavigationState {
    currentScreen: string;
    previousScreen?: string;
    params?: Record<string, any>;
  }
  
  // Leaderboard Types (for future implementation)
  export interface Friend {
    id: string;
    username: string;
    points: number;
    totalSavings: number;
    streak: number;
    avatar: string;
    level: number;
  }
  
  export interface Group {
    id: string;
    name: string;
    inviteCode: string;
    members: Friend[];
    createdBy: string;
    createdAt: Date;
    settings?: {
      isPrivate: boolean;
      allowInvites: boolean;
      maxMembers: number;
    };
  }
  
  export interface LeaderboardEntry {
    rank: number;
    user: Friend;
    score: number;
    change: number; // Change in rank from previous period
  }
  
  // Analytics Types
  export interface UserActivity {
    date: string;
    action: 'spin' | 'accept' | 'complete' | 'reject';
    challengeId?: string;
    pointsEarned?: number;
    savingsAmount?: number;
  }
  
  export interface AnalyticsData {
    totalUsers: number;
    activeUsers: number;
    averagePointsPerUser: number;
    totalSavingsGenerated: number;
    mostPopularChallenges: Challenge[];
    userRetentionRate: number;
  }
  
  // Utility Types
  export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
  export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
  
  // Date/Time Helpers
  export interface TimeFrame {
    start: string;
    end: string;
    label: string;
  }
  
  // Settings Types
  export interface UserPreferences {
    notifications: {
      dailyReminders: boolean;
      challengeUpdates: boolean;
      socialUpdates: boolean;
      emailDigest: boolean;
    };
    privacy: {
      shareStats: boolean;
      allowFriendRequests: boolean;
      showOnLeaderboard: boolean;
    };
    gameplay: {
      difficultyPreference: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
      categoryPreferences: string[];
      autoAcceptEasy: boolean;
    };
  }
  
  // Export commonly used type combinations
  export type AuthenticatedUser = User & {
    stats: WalletWizardUserStats;
    preferences?: UserPreferences;
  };
  
  export type EnhancedChallenge = Challenge & {
    userHistory?: {
      attempted: boolean;
      completed: boolean;
      lastAttemptDate?: string;
    };
  };
  
  export type DetailedSession = SpinSession & {
    challenge: Challenge;
    user: User;
  };
  
  // API Endpoint Types
  export interface ApiEndpoints {
    CUSTOMERS: string;
    PROPOSE_RULE: string;
    SPIN: string;
    LEADERBOARD?: string;
    ANALYTICS?: string;
  }
  
  // Error Types
  export enum ErrorCodes {
    NETWORK_ERROR = 'NETWORK_ERROR',
    AUTH_ERROR = 'AUTH_ERROR',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
    NOT_FOUND = 'NOT_FOUND',
    PERMISSION_DENIED = 'PERMISSION_DENIED'
  }
  
  export interface AppError extends Error {
    code: ErrorCodes;
    details?: any;
    timestamp: string;
  }