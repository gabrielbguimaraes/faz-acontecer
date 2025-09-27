// FazAcontecer/src/screens/AddTaskScreen/AddTaskScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, Alert, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import auth from '@react-native-firebase/auth'; // Importe o 'auth'

import { RootStackParamList } from '../../navigation/AppNavigator';
import { useForm } from '../../hooks/useForm';
import { Button } from '../../components/common/Button';
import { CriarTarefaUseCase } from '../../domain/usecases/CriarTarefaUseCase';
import { FirebaseTarefaDataSource } from '../../data/datasources/FirebaseTarefaDataSource'; // Usando Firebase
import { Tarefa } from '../../domain/entities/tarefa';
import { styles } from './AddTaskScreen.styles';
import { spacing } from '../../theme';

// Injeção de Dependências com Firebase
const firebaseTarefaDataSource = new FirebaseTarefaDataSource();
const criarTarefaUseCase = new CriarTarefaUseCase(firebaseTarefaDataSource);

type AddTaskScreenProps = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

export const AddTaskScreen: React.FC<AddTaskScreenProps> = ({ navigation }) => {
  const { values, handleChange } = useForm({
    titulo: '',
    descricao: '',
  });

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
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

    // Pega o ID do usuário logado
    const currentUser = auth().currentUser;
    if (!currentUser) {
        Alert.alert('Erro', 'Você precisa estar logado para criar uma tarefa.');
        return;
    }

    try {
      const novaTarefa: Partial<Tarefa> = {
        id_usuario: currentUser.uid, // **NOVO: Adicionando o ID do usuário**
        titulo: values.titulo,
        descricao: values.descricao,
        data_execucao: date,
        hora_execucao: date,
        prioridade: 'opcional',
        status: 'pendente',
        concluida: false
      };

      await criarTarefaUseCase.execute(novaTarefa);

      Alert.alert('Sucesso!', 'Sua tarefa foi criada.');
      navigation.goBack();
    } catch (error) {
      // **MELHORIA: Log detalhado do erro no console**
      console.error("Falha ao criar tarefa: ", error);
      Alert.alert('Erro ao Salvar', 'Não foi possível criar a tarefa. Verifique sua conexão ou tente mais tarde.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Adicionar Tarefa</Text>

      <TextInput
        style={styles.input}
        placeholder="Título da tarefa"
        placeholderTextColor="#888"
        value={values.titulo}
        onChangeText={text => handleChange('titulo', text)}
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Descrição (opcional)"
        placeholderTextColor="#888"
        value={values.descricao}
        onChangeText={text => handleChange('descricao', text)}
        multiline
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg }}>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.pickerButtonText}>
            Data: {date.toLocaleDateString('pt-BR')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
          <Text style={styles.pickerButtonText}>
            Hora: {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange}
        />
      )}

      <View style={styles.buttonContainer}>
        <Button title="Salvar Tarefa" onPress={handleAddTask} variant="primary" size="large" />
      </View>
    </SafeAreaView>
  );
};