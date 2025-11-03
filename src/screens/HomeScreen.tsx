import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import notifee, { TimestampTrigger, TriggerType, AndroidImportance } from '@notifee/react-native';
import auth from '@react-native-firebase/auth'; // <-- ADICIONADO (Nível 2)
import { Vibration } from 'react-native'; // <-- ADICIONADO (Nível 1)
import ConfettiCannon from 'react-native-confetti-cannon'; // <-- ADICIONADO (Nível 1)

import { Tarefa } from '../domain/entities/tarefa';
import { BuscarTarefasDoDiaUseCase } from '../domain/usecases/BuscarTarefasDoDiaUseCase';
import { ExcluirTarefaUseCase } from '../domain/usecases/ExcluirTarefaUseCase';
import { MarcarTarefaComoConcluidaUseCase } from '../domain/usecases/MarcarTarefaComoConcluidaUseCase';
import { CriarTarefaUseCase } from '../domain/usecases/CriarTarefaUseCase';
import { FirebaseTarefaDataSource } from '../data/datasources/FirebaseTarefaDataSource';
import { FirebaseUserDataSource } from '../data/datasources/FirebaseUserDataSource'; // <-- ADICIONADO (Nível 2)
import { colors, spacing } from '../theme';
import { styles as screenStyles } from './styles';
import { RootStackParamList } from '../navigation/AppNavigator';
import { TabParamList } from '../navigation/TabNavigator';

// --- INJEÇÃO DE DEPENDÊNCIA ---
// (Nível 2: Agora passamos os dois datasources para o UseCase)
const firebaseTarefaDataSource = new FirebaseTarefaDataSource();
const firebaseUserDataSource = new FirebaseUserDataSource(); // <-- ADICIONADO (Nível 2)
const buscarTarefasDoDiaUseCase = new BuscarTarefasDoDiaUseCase(firebaseTarefaDataSource);
const excluirTarefaUseCase = new ExcluirTarefaUseCase(firebaseTarefaDataSource);
const criarTarefaUseCase = new CriarTarefaUseCase(firebaseTarefaDataSource);

// (Nível 2: O UseCase agora recebe os dois DataSources)
const marcarTarefaComoConcluidaUseCase = new MarcarTarefaComoConcluidaUseCase(
  firebaseTarefaDataSource,
  firebaseUserDataSource // <-- ADICIONADO (Nível 2)
);
// ------------------------------

// (Função de agendamento de alarme recorrente, sem mudanças)
async function scheduleNotification(tarefa: Tarefa) {
  try {
    await notifee.requestPermission();
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: tarefa.data_execucao.getTime(),
    };
    await notifee.createTriggerNotification(
      {
        title: `Hora da Tarefa: ${tarefa.titulo}`,
        body: tarefa.descricao || 'Está na hora de fazer acontecer!',
        android: {
          channelId: 'implacable_alarm',
          importance: AndroidImportance.HIGH,
          sound: 'alarm',
          loopSound: true,
          fullScreenAction: { id: 'default' },
          actions: [{ title: 'Confirmar (Parar Alarme)', pressAction: { id: 'confirm' } }],
        },
      },
      trigger,
    );
    console.log('[Notifee] Alarme da *próxima* tarefa recorrente agendado com sucesso.');
  } catch (error) {
    console.error('[Notifee] Erro ao agendar alarme recorrente:', error);
  }
}

const getCurrentTime = () => {
  const now = new Date();
  const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' };
  const optionsDate: Intl.DateTimeFormatOptions = { weekday: 'long', day: '2-digit', month: 'long', timeZone: 'America/Sao_Paulo' };
  const time = now.toLocaleTimeString('pt-BR', optionsTime);
  const date = now.toLocaleDateString('pt-BR', optionsDate);
  return { time, date: date.charAt(0).toUpperCase() + date.slice(1) };
};

// --- Componente TaskItem ---
// (Sem mudanças aqui, ele já chama onToggle passando a tarefa inteira)
type TaskItemProps = {
  tarefa: Tarefa;
  onToggle: (tarefa: Tarefa) => void;
  onDelete: (id: string) => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ tarefa, onToggle, onDelete }) => {
  const isConcluida = tarefa.concluida;
  const getPriorityColor = () => {
    switch (tarefa.prioridade) {
      case 'urgente': return colors.danger;
      case 'importante': return colors.warning;
      case 'opcional': default: return colors.primary;
    }
  };
  const horaFormatada = tarefa.hora_execucao?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) || '';

return (
    <View style={[screenStyles.taskItem, isConcluida && localStyles.taskItemCompleted]}>
      <View style={[screenStyles.priorityBar, { backgroundColor: getPriorityColor() }]} />
      
      <View style={localStyles.timeContainer}>
        {tarefa.recorrencia !== 'nao_repete' && (
          <Icon name="repeat" size={16} color={colors.textDark} style={{ marginBottom: 4 }} />
        )}
        <Icon name="alarm" size={16} color={colors.textDark} />
        <Text style={localStyles.timeText}>{horaFormatada}</Text>
      </View>

      <View style={screenStyles.taskContent}>
        <Text style={[screenStyles.taskTitle, isConcluida && screenStyles.taskTitleCompleted]}>
          {tarefa.titulo}
        </Text>
        
        {tarefa.descricao ? (
          <Text style={localStyles.descriptionText}>
            {tarefa.descricao}
          </Text>
        ) : null}

      </View>

      <View style={screenStyles.taskActions}>
        
        {/* --- MUDANÇA AQUI: Trocamos CheckBox por um Ícone Pressionável --- */}
        <TouchableOpacity 
          style={localStyles.checkButton} // (Estilo novo para aumentar a área de toque)
          onPress={() => onToggle({ ...tarefa, concluida: !isConcluida })}
        >
          <Icon 
            name={isConcluida ? "check-circle" : "radio-button-unchecked"} 
            size={28} // (Tamanho bem maior)
            color={isConcluida ? colors.success : colors.textSecondary} 
          />
        </TouchableOpacity>
        {/* ----------------------------------------------------------------- */}

        <TouchableOpacity onPress={() => onDelete(tarefa.id_tarefa)} style={{ marginLeft: spacing.sm }}>
          <Icon name="delete-forever" size={24} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
// --- Fim do TaskItem ---

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'HomeTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  
  // --- CORREÇÃO DE BUG ---
  // Os 'useState' foram movidos para DENTRO do componente
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false); // <-- ADICIONADO (Nível 1)
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  // ---------------------

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(getCurrentTime()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchTarefas = useCallback(async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      const loadedTarefas = await buscarTarefasDoDiaUseCase.execute(today);
      const sortedTarefas = loadedTarefas.sort((a, b) => {
        const priorityOrder = { 'urgente': 1, 'importante': 2, 'opcional': 3 };
        return priorityOrder[a.prioridade] - priorityOrder[b.prioridade];
      });
      setTarefas(sortedTarefas);
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

  // --- FUNÇÃO DE RECORRÊNCIA ---
  // (Sem mudanças, mas agora é chamada pelo novo 'handleToggleTask')
  const handleRecurrence = async (tarefaConcluida: Tarefa) => {
    if (!tarefaConcluida.recorrencia || tarefaConcluida.recorrencia === 'nao_repete') {
      return;
    }
    const proximaData = new Date(tarefaConcluida.data_execucao);
    if (tarefaConcluida.recorrencia === 'diariamente') {
      proximaData.setDate(proximaData.getDate() + 1);
    } else if (tarefaConcluida.recorrencia === 'semanalmente') {
      proximaData.setDate(proximaData.getDate() + 7);
    }
    const proximaTarefa: Partial<Tarefa> = {
      ...tarefaConcluida,
      id_tarefa: undefined,
      data_execucao: proximaData,
      hora_execucao: tarefaConcluida.hora_execucao,
      concluida: false,
      status: 'pendente',
    };
    delete (proximaTarefa as any).id_tarefa; 
    try {
      const tarefaRecriada = await criarTarefaUseCase.execute(proximaTarefa);
      await scheduleNotification(tarefaRecriada);
    } catch (error) {
      console.error("Erro ao criar tarefa recorrente:", error);
      Alert.alert("Erro de Recorrência", "Não foi possível criar a próxima tarefa recorrente.");
    }
  };

  // --- FUNÇÃO DE CONCLUIR TAREFA (MODIFICADA) ---
  const handleToggleTask = async (tarefaAtualizada: Tarefa) => {
    const originalTarefas = [...tarefas];
    
    // (Nível 2) Pega o ID do usuário logado
    const userId = auth().currentUser?.uid;
    if (!userId) {
      Alert.alert('Erro', 'Usuário não logado. Não é possível salvar ou pontuar.');
      return;
    }

    // Atualiza a UI imediatamente (otimista)
    setTarefas(currentTarefas =>
      currentTarefas.map(t =>
        t.id_tarefa === tarefaAtualizada.id_tarefa ? tarefaAtualizada : t
      )
    );

    try {
      // (Nível 2) O UseCase agora recebe a tarefa E o userId
      // Seu UseCase (MarcarTarefaComoConcluidaUseCase) precisa ser
      // atualizado para receber o userId e chamar o usuarioRepository.
      await marcarTarefaComoConcluidaUseCase.execute(tarefaAtualizada, userId);

      // Se a tarefa foi marcada como CONCLUÍDA
      if (tarefaAtualizada.concluida === true) {
        
        // --- RECOMPENSA (NÍVEL 1) ---
        Vibration.vibrate(50); // 1. Vibração curta (50ms)
        setShowConfetti(true);  // 2. Dispara o confete
        // ----------------------------

        // 3. Roda a lógica de recorrência (que você já tinha)
        await handleRecurrence(tarefaAtualizada);
        
        // 4. Remove a tarefa da lista (com um delay para o confete)
        setTimeout(() => {
          setTarefas(currentTarefas =>
            currentTarefas.filter(t => t.id_tarefa !== tarefaAtualizada.id_tarefa)
          );
        }, 1200); // Espera 1.2 segundos

      } else {
        // Se a tarefa foi DESMARCADA (voltou a ser pendente)
        // Apenas dá o fetch de novo para garantir a ordem
        fetchTarefas();
      }

    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      Alert.alert("Erro", "Não foi possível atualizar a tarefa.");
      setTarefas(originalTarefas); // Reverte a UI em caso de erro
    }
  };

  // --- FUNÇÃO DE DELETAR (Sem mudanças) ---
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
        <View style={localStyles.emptyContainer}>
          <Icon name="check-circle-outline" size={60} color={colors.textSecondary} />
          <Text style={localStyles.emptyText}>Nenhuma tarefa para hoje.</Text>
          <Text style={localStyles.emptySubText}>Aproveite o dia ou adicione uma nova tarefa!</Text>
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
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
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

      {/* --- (Nível 1) COMPONENTE DO CONFETE --- */}
      {showConfetti && (
        <ConfettiCannon
          count={50} // Quantidade de confetes
          origin={{ x: -10, y: 0 }} // De onde eles vêm (canto esquerdo)
          fadeOut={true} // Desaparecer suavemente
          onAnimationEnd={() => setShowConfetti(false)} // Reseta o estado
        />
      )}
      {/* ------------------------------------ */}

    </View>
  );
};

const localStyles = StyleSheet.create({
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
    color: colors.textDark,
    marginTop: spacing.sm,
  },
  timeContainer: {
    width: 60,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.backgroundDark,
    marginRight: spacing.sm,
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
    marginTop: 4, 
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textDark,
    marginTop: spacing.xs,
  },

  // --- ADICIONE ESTES DOIS NOVOS ESTILOS AQUI ---
  checkButton: {
    padding: spacing.sm, // Aumenta a área de toque em volta do ícone
    marginRight: spacing.xs,
  },
  
  taskItemCompleted: {
    opacity: 0.5, // Deixa o item inteiro mais apagado
  },
  // ---------------------------------------------
});