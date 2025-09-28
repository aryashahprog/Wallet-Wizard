# 🎲 Wallet Wizard - Gamified Savings App

Welcome to **Wallet Wizard**, a gamified personal finance app that makes saving money fun and engaging! Spin the wheel daily to get personalized savings challenges and compete with friends on the leaderboard.

## ✨ Features

- **🎲 Daily Spin Wheel**: Get personalized savings challenges every day
- **🏆 Leaderboard**: Compete with friends and climb the rankings
- **📊 Savings Tracking**: Visualize your progress with interactive charts
- **🎯 Challenge System**: Complete challenges to earn points and save money
- **🔥 Streak Tracking**: Maintain your daily challenge streak
- **💰 Rewards System**: Earn points and unlock achievements

## 🚀 Getting Started

This is an [Expo](https://expo.dev) project built with React Native.

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Wallet-Wizard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Open the app**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `w` to open in web browser
   - Or press `a`/`i` for Android/iOS simulator

## 📱 Demo Account

Try the app with our demo account:
- **Username**: `demo_user`
- **Password**: `password123`

## 🎮 How to Play

1. **Login** with your account or use the demo credentials
2. **Spin the wheel** daily to get a new savings challenge
3. **Accept challenges** that fit your lifestyle and budget
4. **Complete challenges** to earn points and save money
5. **Check the leaderboard** to see how you rank against friends
6. **Track your progress** with detailed savings analytics

## 🏗️ Project Structure

```
Wallet-Wizard/
├── app/                    # Main app screens and navigation
│   ├── (tabs)/            # Tab-based navigation screens
│   │   ├── index.tsx      # Daily Spin screen
│   │   ├── explore.tsx    # Challenge exploration
│   │   └── leaderboard.tsx # Rankings and competition
│   ├── _layout.tsx        # Root layout
│   └── CreateUser.tsx     # Authentication screens
├── components/            # Reusable UI components
│   └── ui/               # UI component library
├── hooks/                # Custom React hooks
├── store/                # State management (Zustand)
├── constants/            # App constants and configuration
└── assets/              # Images, fonts, and other assets
```

## 🛠️ Tech Stack

- **Framework**: Expo / React Native
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: Expo Router
- **UI Components**: React Native built-ins
- **Charts**: Custom SVG-based components
- **Authentication**: Custom hook-based system

## 🎯 Key Features Explained

### Daily Spin Wheel
- Generates personalized savings challenges based on spending patterns
- Challenges range from simple (skip coffee) to complex (meal prep week)
- Points awarded based on challenge difficulty and savings potential

### Leaderboard System
- Global rankings showing all users
- Friends-only view for social competition
- Weekly competitions with bonus rewards
- Rank change tracking and notifications

### Challenge Categories
- **Food & Dining**: Restaurant and food-related savings
- **Transportation**: Commute and travel optimizations
- **Shopping**: Smart purchasing decisions
- **Entertainment**: Leisure and hobby savings
- **Utilities**: Home and service optimizations

### Progress Tracking
- Interactive pie charts showing savings breakdown
- Streak counters for daily engagement
- Achievement badges and level progression
- Detailed analytics and insights

## 🔧 Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Open on Android device/emulator
- `npm run ios` - Open on iOS device/simulator
- `npm run web` - Open in web browser
- `npm run reset-project` - Reset to clean Expo project

### Environment Setup

The app uses mock data for development. In production, you would:

1. Set up a backend API for user management
2. Implement real authentication system
3. Connect to a database for leaderboards and challenges
4. Add push notifications for daily reminders
5. Integrate with banking APIs for real savings tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- Built with [Expo](https://expo.dev)
- Icons and emojis for visual appeal
- Inspired by gamification principles in personal finance
- Community feedback and testing

---

**Happy Saving! 🎯💰**

Transform your financial habits with Wallet Wizard - where every spin brings you closer to your savings goals!