// FazAcontecer/src/screens/CalendarScreen.tsx

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Calendar, LocaleConfig, DateData } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing } from '../theme';
import { Tarefa } from '../domain/entities/tarefa';
import { FirebaseTarefaDataSource } from '../data/datasources/FirebaseTarefaDataSource';
import { BuscarTarefasDoDiaUseCase } from '../domain/usecases/BuscarTarefasDoDiaUseCase';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Configura o calendário para Português-BR
LocaleConfig.locales['pt-br'] = {
  monthNames: [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ],
  monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  dayNamesShort: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-br';

// Instância do UseCase para buscar tarefas
const firebaseTarefaDataSource = new FirebaseTarefaDataSource();
const buscarTarefasDoDiaUseCase = new BuscarTarefasDoDiaUseCase(firebaseTarefaDataSource);

// Componente simples para renderizar a tarefa na lista
const SimpleTaskItem: React.FC<{ item: Tarefa }> = ({ item }) => (
  <View style={styles.taskItem}>
    <Icon name="check-circle-outline" size={20} color={colors.primary} />
    <Text style={styles.taskTitle}>{item.titulo}</Text>
  </View>
);

export const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState<Tarefa[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Busca tarefas sempre que a data selecionada mudar
  const fetchTasks = useCallback(async (dateString: string) => {
    setIsLoading(true);
    setTasks([]); // Limpa as tarefas antigas
    try {
      // Converte a string 'YYYY-MM-DD' para um objeto Date
      const dateObj = new Date(dateString + 'T00:00:00'); 
      const loadedTasks = await buscarTarefasDoDiaUseCase.execute(dateObj);
      setTasks(loadedTasks);
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível buscar as tarefas para esta data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Recarrega as tarefas do dia selecionado quando a tela entra em foco
  useFocusEffect(
    useCallback(() => {
      fetchTasks(selectedDate);
    }, [selectedDate, fetchTasks])
  );

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  // Formata o 'selectedDate' para ser usado no componente Calendar
  const markedDates = useMemo(() => {
    return {
      [selectedDate]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: colors.primary,
        selectedTextColor: colors.textLight,
      },
    };
  }, [selectedDate]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendário</Text>
      <Calendar
        current={selectedDate}
        onDayPress={onDayPress}
        markedDates={markedDates}
        theme={{
          backgroundColor: colors.backgroundDark,
          calendarBackground: colors.surface,
          textSectionTitleColor: colors.textDark,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: colors.primary,
          dayTextColor: colors.textDark,
          textDisabledColor: colors.textSecondary,
          arrowColor: colors.primary,
          monthTextColor: colors.textDark,
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
        style={styles.calendar}
      />

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Tarefas de {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.lg }} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id_tarefa}
          renderItem={({ item }) => <SimpleTaskItem item={item} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma tarefa para este dia.</Text>
            </View>
          }
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    padding: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textLight,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  calendar: {
    borderRadius: 12,
    elevation: 2,
    marginBottom: spacing.lg,
  },
  listHeader: {
    paddingHorizontal: spacing.sm,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: spacing.md,
  },
  list: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 16,
    color: colors.textDark,
    marginLeft: spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});