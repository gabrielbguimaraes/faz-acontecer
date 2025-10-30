// FazAcontecer/src/navigation/AppNavigator.tsx

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

import { LoginScreen } from '../screens/LoginScreen';
import { AddTaskScreen } from '../screens/AddTaskScreen/AddTaskScreen';
import { TabNavigator } from './TabNavigator';
import { AuthLoadingScreen } from '../screens/AuthLoadingScreen';
import { SignUpScreen } from '../screens/SignUpScreen/SignUpScreen'; // Importa a nova tela

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined; // Adiciona a rota de cadastro
  Main: undefined;
  AddTask: undefined;
  AuthLoading: { onAuthSuccess: () => void };
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

  // --- ESTE É O BLOCO return QUE VOCÊ PEDIU ---
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
          // 3. Usuário não logado, mostra as telas de Login E Cadastro
          <Stack.Group>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};