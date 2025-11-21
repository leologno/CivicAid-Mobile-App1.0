import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import FileComplaintScreen from '../screens/FileComplaintScreen';
import AttachMediaScreen from '../screens/AttachMediaScreen';
import TrackComplaintsScreen from '../screens/TrackComplaintsScreen';
import ComplaintDetailsScreen from '../screens/ComplaintDetailsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import AssignTasksScreen from '../screens/AssignTasksScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import AdminManageUsersScreen from '../screens/AdminManageUsersScreen';
import AdminReportsScreen from '../screens/AdminReportsScreen';
import AdminAnalyticsScreen from '../screens/AdminAnalyticsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

// Main App Stack
const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#667eea' },
      headerTintColor: '#FFF',
      headerTitleStyle: { fontWeight: '700', fontSize: 18 },
      headerShadowVisible: true,
    }}
  >
    <Stack.Screen 
      name="Dashboard" 
      component={DashboardScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="FileComplaint" component={FileComplaintScreen} />
    <Stack.Screen name="AttachMedia" component={AttachMediaScreen} />
    <Stack.Screen name="TrackComplaints" component={TrackComplaintsScreen} />
    <Stack.Screen name="ComplaintDetails" component={ComplaintDetailsScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="AssignTasks" component={AssignTasksScreen} />
    <Stack.Screen name="UserProfile" component={UserProfileScreen} />
  </Stack.Navigator>
);

// Admin Stack
const AdminStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#667eea' },
      headerTintColor: '#FFF',
      headerTitleStyle: { fontWeight: '700', fontSize: 18 },
      headerShadowVisible: true,
    }}
  >
    <Stack.Screen name="AdminManageUsers" component={AdminManageUsersScreen} />
    <Stack.Screen name="AdminReports" component={AdminReportsScreen} />
    <Stack.Screen name="AdminAnalytics" component={AdminAnalyticsScreen} />
  </Stack.Navigator>
);

// Main Navigator
const AppNavigator = () => {
  const { isAuthenticated, user, loading } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        {!loading && !isAuthenticated && (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
        {!loading && isAuthenticated && (
          <>
            <Stack.Screen name="App" component={AppStack} />
            {user?.role === 'admin' && (
              <Stack.Screen 
                name="Admin" 
                component={AdminStack}
                options={{ presentation: 'modal' }}
              />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

