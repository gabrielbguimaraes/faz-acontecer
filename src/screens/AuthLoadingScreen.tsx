// FazAcontecer/src/screens/AuthLoadingScreen.tsx

import React, { useEffect } from 'react';
import { View, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme';

// CORREÇÃO: A tela agora usa os props padrões do Stack Navigator
type AuthLoadingScreenProps = NativeStackScreenProps<RootStackParamList, 'AuthLoading'>;

export const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({ route }) => {
  // CORREÇÃO: Pegamos o 'onAuthSuccess' de dentro de 'route.params'
  const { onAuthSuccess } = route.params;
  const rnBiometrics = new ReactNativeBiometrics();

  useEffect(() => {
    const handleBiometrics = async () => {
      try {
        const { available } = await rnBiometrics.isSensorAvailable();

        if (available) {
          const { success } = await rnBiometrics.simplePrompt({
            promptMessage: 'Desbloqueie para continuar',
            cancelButtonText: 'Cancelar',
          });

          if (success) {
            onAuthSuccess();
          } else {
            // Se o usuário cancelar, idealmente deveríamos deslogá-lo
            // auth().signOut(); 
            Alert.alert('Autenticação cancelada.');
          }
        } else {
          onAuthSuccess();
        }
      } catch (error) {
        console.error('Biometric error:', error);
        onAuthSuccess();
      }
    };

    handleBiometrics();
  }, [onAuthSuccess]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
  },
});