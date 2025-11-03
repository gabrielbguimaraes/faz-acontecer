// src/screens/SettingsScreen.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  TextInput, 
  ActivityIndicator, 
  ScrollView,
  TouchableOpacity, // <-- Adicionado
  SafeAreaView      // <-- Adicionado
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native'; // <-- Adicionado
import Icon from 'react-native-vector-icons/MaterialIcons'; // <-- Adicionado

import { BuscarUsuarioUseCase } from '../domain/usecases/BuscarUsuarioUseCase';
import { AtualizarNomeUsuarioUseCase } from '../domain/usecases/AtualizarNomeUsuarioUseCase';
import { AtualizarSenhaUsuarioUseCase } from '../domain/usecases/AtualizarSenhaUsuarioUseCase';
import { FirebaseUserDataSource } from '../data/datasources/FirebaseUserDataSource';

import { colors, spacing } from '../theme';
import { Button } from '../components/common/Button';
import { Usuario } from '../domain/entities/usuario';

// --- Injeção de Dependência (sem mudanças) ---
const firebaseUserDataSource = new FirebaseUserDataSource();
const buscarUsuarioUseCase = new BuscarUsuarioUseCase(firebaseUserDataSource);
const atualizarNomeUseCase = new AtualizarNomeUsuarioUseCase(firebaseUserDataSource);
const atualizarSenhaUseCase = new AtualizarSenhaUsuarioUseCase(firebaseUserDataSource);
// ----------------------------------------

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation(); // <-- Adicionado para o botão de voltar
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nome, setNome] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Busca os dados do usuário ao carregar a tela (sem mudanças)
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const currentUser = auth().currentUser;
      if (currentUser) {
        try {
          const userData = await buscarUsuarioUseCase.execute(currentUser.uid);
          setUsuario(userData);
          setNome(userData?.nome || '');
        } catch (error) {
          Alert.alert("Erro", "Não foi possível carregar seus dados.");
        }
      }
      setIsLoading(false);
    };
    fetchUserData();
  }, []);

  // --- Funções de Handler (sem mudanças) ---
  const handleUpdateName = async () => {
    if (!usuario) return;
    setIsSavingName(true);
    try {
      // (Atualizado para passar o ID do usuário corretamente)
      await atualizarNomeUseCase.execute(usuario.id_usuario, nome);
      Alert.alert('Sucesso!', 'Seu nome foi atualizado.');
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleUpdatePassword = async () => {
    setIsSavingPassword(true);
    try {
      await atualizarSenhaUseCase.execute(novaSenha);
      Alert.alert('Sucesso!', 'Sua senha foi alterada.');
      setNovaSenha('');
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      // (Corrigido o estilo do container de loading)
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    // (Adicionado SafeAreaView para o modal)
    <SafeAreaView style={styles.container}>
      
      {/* --- CABEÇALHO COM BOTÃO DE VOLTAR --- */}
      <View style={styles.header}>
        <Text style={styles.title}>Configurações</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Icon name="close" size={30} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* --- Card de Alterar Nome --- */}
        <View style={styles.card}>
          {/* (Corrigido contraste do label) */}
          <Text style={styles.label}>Alterar Nome de Usuário</Text>
          <TextInput
            style={styles.input} // (Corrigido contraste do input)
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome"
            placeholderTextColor={colors.textSecondary} // (Assumindo que textSecondary é um cinza escuro)
          />
          <Button
            title="Salvar Nome"
            onPress={handleUpdateName}
            variant="primary"
            loading={isSavingName}
          />
        </View>

        {/* --- Card de Alterar Senha --- */}
        <View style={styles.card}>
          {/* (Corrigido contraste do label) */}
          <Text style={styles.label}>Alterar Senha</Text>
          <TextInput
            style={styles.input} // (Corrigido contraste do input)
            value={novaSenha}
            onChangeText={setNovaSenha}
            placeholder="Nova senha (mín. 6 caracteres)"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
          />
          <Button
            title="Salvar Nova Senha"
            onPress={handleUpdatePassword}
            variant="outline"
            loading={isSavingPassword}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- ESTILOS (ATUALIZADOS) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark, // Fundo escuro (correto para o projeto)
  },
  scrollContainer: {
    padding: spacing.lg,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // (Estilo do Header adicionado)
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg, // (Espaçamento no topo para o modal)
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textLight, // (Título claro no fundo escuro)
  },
  closeButton: {
    padding: spacing.xs, // Aumenta a área de toque
  },
  card: {
    backgroundColor: colors.surface, // Card claro (correto)
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark, // <-- CORRIGIDO: Texto escuro no card claro
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.backgroundLight, // <-- CORRIGIDO: Fundo claro (cinza claro)
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textDark, // <-- CORRIGIDO: Texto escuro
    fontSize: 16,
    marginBottom: spacing.md,
  },
});