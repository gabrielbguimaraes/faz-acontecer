import React from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing } from '../theme';
import { Button } from '../components/common/Button';
import auth from '@react-native-firebase/auth';

export const ProfileScreen = () => {
  const currentUser = auth().currentUser;

  const handlePasswordReset = () => {
    if (currentUser && currentUser.email) {
      auth()
        .sendPasswordResetEmail(currentUser.email)
        .then(() => {
          Alert.alert(
            'Verifique seu E-mail',
            `Enviamos um link de redefinição de senha para ${currentUser.email}.`,
          );
        })
        .catch(error => {
          Alert.alert('Erro', error.message);
        });
    } else {
      Alert.alert('Erro', 'Não foi possível encontrar um e-mail de usuário logado.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Perfil & Configurações</Text>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>
          <Text style={styles.emailText}>Logado como: {currentUser?.email}</Text>
          
          <Button
            title="Redefinir Senha"
            onPress={handlePasswordReset}
            variant="secondary"
          />
          <View style={{ marginTop: spacing.md }} />
          <Button
            title="Sair (Logout)"
            onPress={() => auth().signOut()}
            variant="danger"
          />
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <Button
            title="Mudar Som do Alarme"
            onPress={() => Alert.alert('Em Breve', 'Funcionalidade de mudar o som do alarme será adicionada aqui.')}
            variant="outline"
          />

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textLight,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  emailText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
});