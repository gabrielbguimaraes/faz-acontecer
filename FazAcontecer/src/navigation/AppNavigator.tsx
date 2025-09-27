// FazAcontecer/src/navigation/AppNavigator.tsx

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

import { LoginScreen } from '../screens/LoginScreen';
import { AddTaskScreen } from '../screens/AddTaskScreen/AddTaskScreen';
import { TabNavigator } from './TabNavigator';
import { AuthLoadingScreen } from '../screens/AuthLoadingScreen'; // Importe a nova tela

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  AddTask: undefined;
  AuthLoading: { onAuthSuccess: () => void }; // Nova rota
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const [user, setUser] = useState<any | null>(null);
  const [isBiometricAuthenticated, setIsBiometricAuthenticated] = useState(false);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userState => {
      setUser(userState);
      // Se o usuário fizer logout, resetamos a autenticação biométrica
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
            // 1. Usuário logado, mas biometria ainda não passou
            <Stack.Screen
              name="AuthLoading"
              component={AuthLoadingScreen}
              initialParams={{ onAuthSuccess: handleAuthSuccess }}
            />
          ) : (
            // 2. Biometria OK, mostra as telas principais
            <Stack.Group>
              <Stack.Screen name="Main" component={TabNavigator} />
              <Stack.Screen name="AddTask" component={AddTaskScreen} />
            </Stack.Group>
          )
        ) : (
          // 3. Usuário não logado, mostra a tela de login
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};