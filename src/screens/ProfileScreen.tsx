import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import { Usuario } from '../domain/entities/usuario';
import { BuscarUsuarioUseCase } from '../domain/usecases/BuscarUsuarioUseCase';
import { FirebaseUserDataSource } from '../data/datasources/FirebaseUserDataSource';
import { colors, spacing } from '../theme';
import { Button } from '../components/common/Button'; // (Estou assumindo que você tem um botão)

// --- Injeção de Dependência ---
const firebaseUserDataSource = new FirebaseUserDataSource();
const buscarUsuarioUseCase = new BuscarUsuarioUseCase(firebaseUserDataSource);
// ------------------------------

export const ProfileScreen: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar os dados do usuário
  const fetchUserData = useCallback(async () => {
    setIsLoading(true);
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert("Erro", "Nenhum usuário logado.");
      setIsLoading(false);
      return;
    }

    try {
      const userData = await buscarUsuarioUseCase.execute(currentUser.uid);
      setUsuario(userData);
    } catch (error) {
      console.error("Erro ao buscar dados do perfil:", error);
      Alert.alert("Erro", "Não foi possível carregar seus dados.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // useFocusEffect é chamado toda vez que o usuário entra nesta tela (aba)
  // Isso garante que a pontuação esteja sempre atualizada
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  const handleLogout = async () => {
    try {
      await auth().signOut();
      // A navegação para o 'AuthStack' será tratada pelo AppNavigator (ou onde quer que sua lógica de auth esteja)
    } catch (error) {
      Alert.alert("Erro", "Não foi possível fazer logout.");
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      {/* --- Card de Informações --- */}
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>{usuario?.nome || '...'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{usuario?.email || '...'}</Text>
        </View>
      </View>

      {/* --- Card de Gamificação --- */}
      <Text style={styles.title}>Minha Jornada</Text>
      <View style={styles.card}>
        <View style={styles.statsRow}>
          
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{usuario?.pontuacao ?? 0}</Text>
            <Text style={styles.statLabel}>Pontos</Text>
          </View>
          
          <View style={styles.statSeparator} />
          
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{usuario?.nivel ?? 0}</Text>
            <Text style={styles.statLabel}>Nível</Text>
          </View>

        </View>
      </View>
      
      <View style={{ flex: 1 }} /> 

      <Button
        title="Sair (Logout)"
        onPress={handleLogout}
        variant="danger"
        size="large"
      />
    </View>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    padding: spacing.lg,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textLight,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  // Card de Informações
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: '600',
  },
  // Card de Gamificação
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textDark,
    marginTop: spacing.xs,
  },
  statSeparator: {
    width: 1,
    backgroundColor: colors.backgroundDark,
  },
});