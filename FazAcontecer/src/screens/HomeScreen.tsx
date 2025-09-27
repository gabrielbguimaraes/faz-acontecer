// FazAcontecer/src/screens/HomeScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CheckBox } from 'react-native-elements';

import { Tarefa } from '../domain/entities/tarefa';
import { BuscarTarefasDoDiaUseCase } from '../domain/usecases/BuscarTarefasDoDiaUseCase';
import { ExcluirTarefaUseCase } from '../domain/usecases/ExcluirTarefaUseCase';
import { MarcarTarefaComoConcluidaUseCase } from '../domain/usecases/MarcarTarefaComoConcluidaUseCase';
import { FirebaseTarefaDataSource } from '../data/datasources/FirebaseTarefaDataSource';
import { colors, spacing } from '../theme';
import { styles as screenStyles } from './styles';
import { RootStackParamList } from '../navigation/AppNavigator';
import { TabParamList } from '../navigation/TabNavigator';

// INJEÇÃO DE DEPENDÊNCIAS
const firebaseTarefaDataSource = new FirebaseTarefaDataSource();
const buscarTarefasDoDiaUseCase = new BuscarTarefasDoDiaUseCase(firebaseTarefaDataSource);
const excluirTarefaUseCase = new ExcluirTarefaUseCase(firebaseTarefaDataSource);
const marcarTarefaComoConcluidaUseCase = new MarcarTarefaComoConcluidaUseCase(firebaseTarefaDataSource);

const getCurrentTime = () => {
  const now = new Date();
  const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' };
  const optionsDate: Intl.DateTimeFormatOptions = { weekday: 'long', day: '2-digit', month: 'long', timeZone: 'America/Sao_Paulo' };
  const time = now.toLocaleTimeString('pt-BR', optionsTime);
  const date = now.toLocaleDateString('pt-BR', optionsDate);
  return { time, date: date.charAt(0).toUpperCase() + date.slice(1) };
};

type TaskItemProps = {
  tarefa: Tarefa;
  onToggle: (tarefa: Tarefa) => void;
  onDelete: (id: string) => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ tarefa, onToggle, onDelete }) => {
  const isConcluida = tarefa.concluida;
  const priorityColor = tarefa.prioridade === 'urgente' ? colors.danger : (tarefa.prioridade === 'importante' ? colors.secondary : colors.primary);

  return (
    <View style={screenStyles.taskItem}>
      <View style={[screenStyles.priorityBar, { backgroundColor: priorityColor }]} />
      <View style={screenStyles.taskContent}>
        <Text style={[screenStyles.taskTitle, isConcluida && screenStyles.taskTitleCompleted]}>
          {tarefa.titulo}
        </Text>
        <Text style={screenStyles.taskTime}>
          {tarefa.hora_execucao?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) || ''}
        </Text>
      </View>
      <View style={screenStyles.taskActions}>
        <CheckBox
          checked={isConcluida}
          onPress={() => onToggle({ ...tarefa, concluida: !isConcluida })}
          containerStyle={screenStyles.checkboxContainer}
          checkedColor={colors.success}
          uncheckedColor={colors.surface}
        />
        <TouchableOpacity onPress={() => onDelete(tarefa.id_tarefa)} style={{ marginLeft: spacing.sm }}>
          <Icon name="delete-forever" size={24} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'HomeTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(getCurrentTime()), 60000); // Atualiza a cada minuto
    return () => clearInterval(timer);
  }, []);

  const fetchTarefas = useCallback(async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      const loadedTarefas = await buscarTarefasDoDiaUseCase.execute(today);
      setTarefas(loadedTarefas);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      Alert.alert("Erro de Carga", "Não foi possível carregar as tarefas.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    fetchTarefas();
  }, [fetchTarefas]));

  const handleToggleTask = async (tarefaAtualizada: Tarefa) => {
    const originalTarefas = [...tarefas];
    setTarefas(currentTarefas =>
      currentTarefas.map(t =>
        t.id_tarefa === tarefaAtualizada.id_tarefa ? tarefaAtualizada : t
      )
    );
    try {
      await marcarTarefaComoConcluidaUseCase.execute(tarefaAtualizada);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      Alert.alert("Erro", "Não foi possível atualizar a tarefa.");
      setTarefas(originalTarefas);
    }
  };

  const handleDeleteTask = (id_tarefa: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja excluir esta tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await excluirTarefaUseCase.execute(id_tarefa);
              setTarefas(currentTarefas => currentTarefas.filter(t => t.id_tarefa !== id_tarefa));
            } catch (error) {
              console.error("Erro ao excluir tarefa:", error);
              Alert.alert("Erro", "Não foi possível excluir a tarefa.");
            }
          },
        },
      ]
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />;
    }
    if (tarefas.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="check-circle-outline" size={60} color={colors.textSecondary} />
          <Text style={styles.emptyText}>Nenhuma tarefa para hoje.</Text>
          <Text style={styles.emptySubText}>Aproveite o dia ou adicione uma nova tarefa!</Text>
        </View>
      );
    }
    return (
      <ScrollView contentContainerStyle={screenStyles.tasksContentContainer}>
        {tarefas.map(tarefa => (
          <TaskItem
            key={tarefa.id_tarefa}
            tarefa={tarefa}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={screenStyles.container}>
      <View style={screenStyles.header}>
        <View>
          <Text style={screenStyles.dateText}>{currentTime.date}</Text>
          <Text style={screenStyles.timeText}>{currentTime.time}</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert("Funcionalidade", "Configurações")}>
          <Icon name="settings" size={30} color={colors.textLight} />
        </TouchableOpacity>
      </View>
      <View style={screenStyles.tasksContainer}>
        <Text style={screenStyles.sectionTitle}>Tarefas de hoje</Text>
        {renderContent()}
      </View>
      <TouchableOpacity style={screenStyles.fab} onPress={() => navigation.navigate('AddTask')}>
        <Icon name="add" size={30} color={colors.textLight} />
      </TouchableOpacity>
    </View>
  );
};

// Adicione estes estilos que podem estar faltando
const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: spacing.xl * 2,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textDark,
        marginTop: spacing.md,
    },
    emptySubText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },
});