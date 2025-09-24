import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LoginScreen } from './src/screens/LoginScreen';

const App = () => {
  return (
    <NavigationContainer>
      <LoginScreen />
    </NavigationContainer>
  );
};

export default App;