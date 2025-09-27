// FazAcontecer/src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { HomeScreen } from '../screens/HomeScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = 'home';
          const activeColor = colors.primary;
          const inactiveColor = colors.textSecondary;

          if (route.name === 'HomeTab') {
            iconName = 'home';
          } else if (route.name === 'CalendarTab') {
            iconName = 'calendar-today';
          } else if (route.name === 'ProfileTab') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={focused ? activeColor : inactiveColor} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="CalendarTab" component={CalendarScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
};