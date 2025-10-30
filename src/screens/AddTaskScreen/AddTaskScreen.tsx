import React, { useState } from 'react';
import { View, Text, TextInput, Alert, SafeAreaView, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import auth from '@react-native-firebase/auth';
import notifee, { TimestampTrigger, TriggerType, AndroidImportance } from '@notifee/react-native';

import { RootStackParamList } from '../../navigation/AppNavigator';
import { useForm } from '../../hooks/useForm';
import { Button } from '../../components/common/Button';
import { CriarTarefaUseCase } from '../../domain/usecases/CriarTarefaUseCase';
import { FirebaseTarefaDataSource } from '../../data/datasources/FirebaseTarefaDataSource';
import { Tarefa } from '../../domain/entities/tarefa';
import { styles as mainStyles } from './AddTaskScreen.styles';
import { colors, spacing } from '../../theme';

const firebaseTarefaDataSource = new FirebaseTarefaDataSource();
const criarTarefaUseCase = new CriarTarefaUseCase(firebaseTarefaDataSource);

type Prioridade = Tarefa['prioridade'];
type AddTaskScreenProps = NativeStackScreenProps<RootStackParamList, 'AddTask'>;


async function scheduleNotification(tarefa: Tarefa) {
  

  if (!tarefa.data_execucao) {
    console.error("[DEBUG] scheduleNotification: Tarefa sem data de execução. Alarme não pode ser agendado.");
    return;
  }


  try {
    console.log("[DEBUG] scheduleNotification: Pedindo permissão...");
    await notifee.requestPermission();

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: tarefa.data_execucao.getTime(),
    };
    console.log(`[DEBUG] scheduleNotification: Gatilho criado para ${new Date(trigger.timestamp)}`);

    await notifee.createTriggerNotification(
      {
        title: `Hora da Tarefa: ${tarefa.titulo}`,
        body: tarefa.descricao || 'Está na hora de fazer acontecer!',
        android: {
          channelId: 'implacable_alarm',
          importance: AndroidImportance.HIGH,
          sound: 'alarm',
          loopSound: true,
          fullScreenAction: {
            id: 'default',
          },
          actions: [
            {
              title: 'Confirmar (Parar Alarme)',
              pressAction: {
                id: 'confirm',
              },
            },
          ],
        },
      },
      trigger,
    );
    console.log("[DEBUG] scheduleNotification: Notificação agendada com sucesso!");

  } catch (error) {
    console.error('[DEBUG] Erro em scheduleNotification:', error);
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
    console.log("[DEBUG] handleAddTask: Botão 'Salvar' pressionado.");

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
      console.log("[DEBUG] handleAddTask: Entrou no bloco try.");
      const novaTarefa: Partial<Tarefa> = {
        id_usuario: currentUser.uid,
        titulo: values.titulo,
        descricao: values.descricao,
        data_execucao: date,
        hora_execucao: date,
        concluida: false,
        status: 'pendente',
        prioridade: prioridade,
      };

      console.log("[DEBUG] handleAddTask: Chamando criarTarefaUseCase...");
      const tarefaCompleta = await criarTarefaUseCase.execute(novaTarefa);
      console.log("[DEBUG] handleAddTask: Tarefa criada com sucesso no Firebase:", tarefaCompleta.id_tarefa);

      console.log("[DEBUG] handleAddTask: Chamando scheduleNotification...");
      await scheduleNotification(tarefaCompleta);
      console.log("[DEBUG] handleAddTask: scheduleNotification concluído.");

      Alert.alert('Sucesso!', 'Sua tarefa foi criada e o alarme agendado.');
      navigation.goBack();

    } catch (error) {
      console.error("[DEBUG] handleAddTask: Erro pego no bloco catch:", error);
      Alert.alert('Erro ao Salvar', (error as Error).message);
    }
  };

  return (
    <SafeAreaView style={mainStyles.container}>
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


      {showDatePicker && (<DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />)}
      {showTimePicker && (<DateTimePicker value={date} mode="time" is24Hour={true} display="default" onChange={onTimeChange} />)}

      <View style={mainStyles.buttonContainer}>
        <Button title="Salvar Tarefa" onPress={handleAddTask} variant="primary" size="large" />
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
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
    borderColor: 'transparent',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  priorityTextActive: {
      color: colors.textLight,
  },
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