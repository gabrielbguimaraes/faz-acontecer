// FazAcontecer/src/screens/LoginScreen.tsx

import React from 'react';
import { View, TextInput, StyleSheet, Alert, Image, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button } from '../components/common/Button';
import { colors, spacing } from '../theme';
import { useForm } from '../hooks/useForm';

import { FirebaseUserDataSource } from '../data/datasources/FirebaseUserDataSource';
import { AutenticarUsuarioUseCase } from '../domain/usecases/AutenticarUsuarioUseCase';

const userDataSource = new FirebaseUserDataSource();
const autenticarUsuarioUseCase = new AutenticarUsuarioUseCase(userDataSource);

const Logo = require('../assets/images/logo_faz_acontecer_transparente2.png');

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { values, handleChange } = useForm({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    if (!values.email || !values.password) {
      Alert.alert('Campos Vazios', 'Por favor, preencha e-mail e senha.');
      return;
    }
    try {
      const usuario = await autenticarUsuarioUseCase.execute(values.email, values.password);

      if (!usuario) {
        // A imagem de erro apareceu aqui
        Alert.alert('Erro de Login', 'Credencial inválida ou erro de rede.');
      }
      // Se o login for bem-sucedido, o AppNavigator vai mudar de tela automaticamente
    } catch (error) {
      Alert.alert('Erro Inesperado', 'Ocorreu um erro ao tentar fazer login.');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
      
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor={colors.textSecondary}
          value={values.email}
          onChangeText={text => handleChange('email', text)}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={colors.textSecondary}
          value={values.password}
          onChangeText={text => handleChange('password', text)}
          secureTextEntry
        />
        
        <Button title="Login" onPress={handleLogin} variant="primary" size="large" />
      </View>

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => Alert.alert('Funcionalidade futura', 'Ainda será implementada.')}>
          <Text style={styles.linkText}>
            Esqueceu sua senha?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>
            Não tem uma conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        Powered by FATEC
      </Text>
    </SafeAreaView>
  );
};

// --- Estilos Corrigidos e Completos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: spacing.lg,
  },
  formContainer: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
    color: colors.textDark,
    fontSize: 16,
  },
  linksContainer: {
    width: '80%',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  linkText: {
    fontSize: 14,
    color: colors.primary,
    marginVertical: spacing.sm,
    textDecorationLine: 'underline',
  },
  footerText: {
    position: 'absolute',
    bottom: spacing.lg,
    fontSize: 12,
    color: colors.textSecondary,
  },
});