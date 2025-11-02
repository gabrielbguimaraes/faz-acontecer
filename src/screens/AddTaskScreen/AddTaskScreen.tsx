// FazAcontecer/src/screens/AddTaskScreen/AddTaskScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Alert, SafeAreaView, TouchableOpacity, Platform, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import auth from '@react-native-firebase/auth';
import notifee, { TimestampTrigger, TriggerType, AndroidImportance } from '@notifee/react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { useForm } from '../../hooks/useForm';
import { Button } from '../../components/common/Button';
import { CriarTarefaUseCase } from '../../domain/usecases/CriarTarefaUseCase';
import { FirebaseTarefaDataSource } from '../../data/datasources/FirebaseTarefaDataSource';
import { Tarefa, TipoRecorrencia, Localizacao } from '../../domain/entities/tarefa';
import { styles as mainStyles } from './AddTaskScreen.styles';
import { colors, spacing } from '../../theme';

// Injeção de Dependências
const firebaseTarefaDataSource = new FirebaseTarefaDataSource();
const criarTarefaUseCase = new CriarTarefaUseCase(firebaseTarefaDataSource);

type Prioridade = Tarefa['prioridade'];
type AddTaskScreenProps = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

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
    console.log('[Notifee] Alarme agendado com sucesso para:', new Date(trigger.timestamp));
  } catch (error) {
    console.error('[Notifee] Erro ao agendar:', error);
    Alert.alert('Erro no Alarme', 'A tarefa foi salva, mas não foi possível agendar o alarme.');
  }
}

export const AddTaskScreen: React.FC<AddTaskScreenProps> = ({ navigation }) => {
  const { values, handleChange } = useForm({
    titulo: '',
    descricao: '',
  });

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [prioridade, setPrioridade] = useState<Prioridade>('opcional');
  const [recorrencia, setRecorrencia] = useState<TipoRecorrencia>('nao_repete');
  const [localizacao, setLocalizacao] = useState<Localizacao | undefined>(undefined);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const handleAddTask = async () => {
    if (!values.titulo) {
      Alert.alert('Campo Obrigatório', 'Por favor, insira um título para a tarefa.');
      return;
    }
    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Erro', 'Você precisa estar logado para criar uma tarefa.');
      return;
    }

    try {
      const novaTarefa: Partial<Tarefa> = {
        id_usuario: currentUser.uid,
        titulo: values.titulo,
        descricao: values.descricao,
        data_execucao: date,
        hora_execucao: date,
        concluida: false,
        status: 'pendente',
        prioridade: prioridade,
        recorrencia: recorrencia,
        localizacao: localizacao, // <-- Salva a localização
      };

      const tarefaCompleta = await criarTarefaUseCase.execute(novaTarefa);
      
      Alert.alert('Sucesso!', 'Sua tarefa foi criada.');
      navigation.goBack(); 

      if (tarefaCompleta.recorrencia === 'nao_repete') {
        await scheduleNotification(tarefaCompleta);
      }

    } catch (error) {
      console.error("[handleAddTask] Erro ao salvar:", error);
      Alert.alert('Erro ao Salvar', (error as Error).message);
    }
  };
  
  // NOVO: Função para abrir o mapa
  const handleOpenMap = () => {
    navigation.navigate('MapPicker', {
      onLocationSelect: (loc) => setLocalizacao(loc),
    });
  };

  return (
    <SafeAreaView style={mainStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.lg }}>
        <Text style={mainStyles.title}>Adicionar Tarefa</Text>

        <TextInput
          style={mainStyles.input}
          placeholder="Título da tarefa"
          placeholderTextColor="#888"
          value={values.titulo}
          onChangeText={text => handleChange('titulo', text)}
        />
        <TextInput
          style={[mainStyles.input, mainStyles.descriptionInput]}
          placeholder="Descrição (opcional)"
          placeholderTextColor="#888"
          value={values.descricao}
          onChangeText={text => handleChange('descricao', text)}
          multiline
        />

        {/* Seletores de Data e Hora */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg }}>
          <TouchableOpacity style={mainStyles.pickerButton} onPress={() => setShowDatePicker(true)}>
            <Text style={mainStyles.pickerButtonText}>
              Data: {date.toLocaleDateString('pt-BR')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={mainStyles.pickerButton} onPress={() => setShowTimePicker(true)}>
            <Text style={mainStyles.pickerButtonText}>
              Hora: {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Seletor de Prioridade */}
        <Text style={styles.label}>Prioridade:</Text>
        <View style={styles.priorityContainer}>
          <TouchableOpacity
            style={[styles.priorityButton, prioridade === 'urgente' && styles.priorityUrgente]}
            onPress={() => setPrioridade('urgente')}>
            <Text style={[styles.priorityButtonText, prioridade === 'urgente' && styles.priorityTextActive]}>Urgente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.priorityButton, prioridade === 'importante' && styles.priorityImportante]}
            onPress={() => setPrioridade('importante')}>
            <Text style={[styles.priorityButtonText, prioridade === 'importante' && styles.priorityTextActive]}>Importante</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.priorityButton, prioridade === 'opcional' && styles.priorityOpcional]}
            onPress={() => setPrioridade('opcional')}>
            <Text style={[styles.priorityButtonText, prioridade === 'opcional' && styles.priorityTextActive]}>Opcional</Text>
          </TouchableOpacity>
        </View>

        {/* Seletor de Recorrência */}
        <Text style={styles.label}>Repetir:</Text>
        <View style={styles.priorityContainer}>
          <TouchableOpacity
            style={[styles.priorityButton, recorrencia === 'nao_repete' && styles.priorityActive]}
            onPress={() => setRecorrencia('nao_repete')}>
            <Text style={[styles.priorityButtonText, recorrencia === 'nao_repete' && styles.priorityTextActive]}>Nunca</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.priorityButton, recorrencia === 'diariamente' && styles.priorityActive]}
            onPress={() => setRecorrencia('diariamente')}>
            <Text style={[styles.priorityButtonText, recorrencia === 'diariamente' && styles.priorityTextActive]}>Diariamente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.priorityButton, recorrencia === 'semanalmente' && styles.priorityActive]}
            onPress={() => setRecorrencia('semanalmente')}>
            <Text style={[styles.priorityButtonText, recorrencia === 'semanalmente' && styles.priorityTextActive]}>Semanalmente</Text>
          </TouchableOpacity>
        </View>
        
        {/* --- NOVO BOTÃO DE LOCALIZAÇÃO --- */}
        <Text style={styles.label}>Localização:</Text>
        <Button
          title={localizacao ? `Localização Salva! (Lat: ${localizacao.latitude.toFixed(2)})` : 'Adicionar Localização'}
          onPress={handleOpenMap} // <-- Chama a função
          variant={localizacao ? 'secondary' : 'outline'}
          size="large"
          icon={<Icon name="location-on" size={20} color={localizacao ? colors.textLight : colors.primary} />}
        />
        {/* ------------------------------- */}

        {/* Pickers (ocultos) */}
        {showDatePicker && (<DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />)}
        {showTimePicker && (<DateTimePicker value={date} mode="time" is24Hour={true} display="default" onChange={onTimeChange} />)}

        <View style={mainStyles.buttonContainer}>
          <Button title="Salvar Tarefa" onPress={handleAddTask} variant="primary" size="large" />
          <View style={{ marginTop: spacing.md }} /> 
          <Button 
            title="Cancelar" 
            onPress={() => navigation.goBack()}
            variant="outline"
            size="large" 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Estilos
const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.xs,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  priorityTextActive: {
      color: colors.textLight,
  },
  // Cor para botões de recorrência ativos
  priorityActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  // Cores para prioridade
  priorityUrgente: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  priorityImportante: {
    backgroundColor: colors.warning,
    borderColor: colors.warning,
  },
  priorityOpcional: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});