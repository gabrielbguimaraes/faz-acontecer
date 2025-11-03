// FazAcontecer/src/navigation/AppNavigator.tsx

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import { SettingsScreen } from '../screens/SettingsScreen';

import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen/SignUpScreen';
import { AuthLoadingScreen } from '../screens/AuthLoadingScreen';
import { TabNavigator } from './TabNavigator';
import { AddTaskScreen } from '../screens/AddTaskScreen/AddTaskScreen';
import { MapPickerScreen } from '../screens/MapPickerScreen/MapPickerScreen'; // <-- 1. IMPORTE A TELA
import { Localizacao } from '../domain/entities/tarefa'; // <-- 2. IMPORTE O TIPO

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined; 
  AuthLoading: { onAuthSuccess: () => void };
  Main: undefined;
  Settings: undefined;
  AddTask: undefined;
  // --- 3. ADICIONE A ROTA E SEUS PARÂMETROS ---
  MapPicker: {
    onLocationSelect: (location: Localizacao) => void;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const [user, setUser] = useState<any | null>(null);
  const [isBiometricAuthenticated, setIsBiometricAuthenticated] = useState(false);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userState => {
      setUser(userState);
      if (!userState) {
        setIsBiometricAuthenticated(false);
      }
    });
    return subscriber;
  }, []);

  const handleAuthSuccess = () => {
    setIsBiometricAuthenticated(true);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          !isBiometricAuthenticated ? (
            <Stack.Screen
              name="AuthLoading"
              component={AuthLoadingScreen}
              initialParams={{ onAuthSuccess: handleAuthSuccess }}
            />
          ) : (
            <Stack.Group>
              <Stack.Screen name="Main" component={TabNavigator} />
              <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ presentation: 'modal' }} />
              <Stack.Screen name="MapPicker" component={MapPickerScreen} />
              <Stack.Screen 
                name="Settings" 
                component={SettingsScreen} 
                options={{ 
                  title: 'Configurações',
                  presentation: 'modal', 
                }} 
              />
            </Stack.Group>
          )
        ) : (
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};