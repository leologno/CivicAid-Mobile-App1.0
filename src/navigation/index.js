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
import SettingsScreen from '../screens/SettingsScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import { View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);

// Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: COLORS.surface,
        borderTopWidth: 0,
        elevation: 15, // Higher elevation for floating input
        height: Platform.OS === 'ios' ? 85 : 70, // Slightly taller
        paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        borderRadius: 20, // Rounded corners all around
        margin: 16, // Float from edges
        position: 'absolute', // Float above content
        bottom: 0,
        left: 0,
        right: 0,
        ...SHADOWS.large,
      },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'HomeTab') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'TasksTab') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'AddTab') {
          iconName = 'add-circle';
        } else if (route.name === 'EmergencyTab') {
          iconName = focused ? 'warning' : 'warning-outline';
        } else if (route.name === 'ProfileTab') {
          iconName = focused ? 'person' : 'person-outline';
        }

        // Custom big button for Add
        if (route.name === 'AddTab') {
          return (
            <View style={{
              top: -25, // Adjusted for floating bar height
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: COLORS.primary,
              justifyContent: 'center',
              alignItems: 'center',
              ...SHADOWS.modern,
            }}>
              <Ionicons name="add" size={32} color="#FFF" />
            </View>
          );
        }

        return <Ionicons name={iconName} size={24} color={focused ? COLORS.primary : COLORS.textLight} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textLight,
    })}
  >
    <Tab.Screen name="HomeTab" component={DashboardScreen} />
    <Tab.Screen name="TasksTab" component={TrackComplaintsScreen} />
    <Tab.Screen
      name="AddTab"
      component={FileComplaintScreen}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault();
          navigation.navigate('FileComplaint');
        },
      })}
    />
    <Tab.Screen name="EmergencyTab" component={EmergencyScreen} />
    <Tab.Screen name="ProfileTab" component={UserProfileScreen} />
  </Tab.Navigator>
);

// Main App Stack
const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: '#FFF',
      headerTitleStyle: { fontWeight: '700', fontSize: 18 },
      headerShadowVisible: true,
    }}
  >
    {/* Tab Navigator is the new "Home" */}
    <Stack.Screen
      name="MainTabs"
      component={TabNavigator}
      options={{ headerShown: false }}
    />

    {/* Standalone Screens */}
    <Stack.Screen name="FileComplaint" component={FileComplaintScreen} />
    <Stack.Screen name="AttachMedia" component={AttachMediaScreen} />
    <Stack.Screen name="ComplaintDetails" component={ComplaintDetailsScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="AssignTasks" component={AssignTasksScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

// Admin Stack
const AdminStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
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

