// FazAcontecer/App.tsx
import React from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';

// IMPORTANTE: Se você usava o LoginScreen diretamente aqui, remova.
// Agora o AppNavigator é o componente principal.

const App = () => {
  return (
    <AppNavigator />
  );
};

export default App;