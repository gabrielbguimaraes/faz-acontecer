// FazAcontecer/src/navigation/AppNavigator.tsx

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'; 
import { LoginScreen } from '../screens/LoginScreen'; 
import { HomeScreen } from '../screens/HomeScreen'; 

// ---------------------------------------------------
// 1. Tipagem das rotas (Corrigida)
// ---------------------------------------------------
export type RootStackParamList = {
    // Definimos explicitamente o tipo do parâmetro 'onLoginSuccess'
    Login: { onLoginSuccess: () => void }; 
    Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ---------------------------------------------------
// 2. Componente do Navigator (Lógica de Autenticação)
// ---------------------------------------------------
export const AppNavigator = () => {
    // ... (restante do código)
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };
    
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isLoggedIn ? (
                    <Stack.Screen name="Home" component={HomeScreen} />
                ) : (
                    <Stack.Screen 
                        name="Login" 
                        component={LoginScreen}
                        initialParams={{ onLoginSuccess: handleLoginSuccess }}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};