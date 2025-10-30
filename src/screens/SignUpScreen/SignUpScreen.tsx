// FazAcontecer/src/screens/SignUpScreen/SignUpScreen.tsx

import React from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Button } from '../../components/common/Button';
import { colors, spacing } from '../../theme';
import { useForm } from '../../hooks/useForm';

import { FirebaseUserDataSource } from '../../data/datasources/FirebaseUserDataSource';
import { CriarUsuarioUseCase } from '../../domain/usecases/CriarUsuarioUseCase';

// UseCases para esta tela
const userDataSource = new FirebaseUserDataSource();
const criarUsuarioUseCase = new CriarUsuarioUseCase(userDataSource);

const Logo = require('../../assets/images/logo_faz_acontecer_transparente2.png');

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { values, handleChange } = useForm({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSignUp = async () => {
    if (!values.email || !values.password) {
      Alert.alert('Campos Vazios', 'Por favor, preencha e-mail e senha.');
      return;
    }
    if (values.password !== values.confirmPassword) {
      Alert.alert('Senhas Diferentes', 'As senhas não coincidem.');
      return;
    }

    try {
      const usuario = await criarUsuarioUseCase.execute(values.email, values.password);
      if (usuario) {
        // Sucesso! O AppNavigator vai detectar o login e levar para o app
      }
    } catch (error) {
      Alert.alert('Erro ao Cadastrar', (error as Error).message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Criar Nova Conta</Text>
      
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
          placeholder="Senha (mín. 6 caracteres)"
          placeholderTextColor={colors.textSecondary}
          value={values.password}
          onChangeText={text => handleChange('password', text)}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Senha"
          placeholderTextColor={colors.textSecondary}
          value={values.confirmPassword}
          onChangeText={text => handleChange('confirmPassword', text)}
          secureTextEntry
        />
        
        <Button title="Cadastrar" onPress={handleSignUp} variant="primary" size="large" />

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>
            Já tem uma conta? Faça Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Estilos (pode reutilizar os da LoginScreen se preferir)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textLight,
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
  linkText: {
    marginTop: spacing.lg,
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});