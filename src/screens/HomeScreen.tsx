// FazAcontecer/src/screens/Home/HomeScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CheckBox } from 'react-native-elements';
import { Tarefa } from '../domain/entities/tarefa';
import { BuscarTarefasDoDiaUseCase } from '../domain/usecases/BuscarTarefasDoDiaUseCase';
import { MarcarTarefaComoConcluidaUseCase } from '../domain/usecases/MarcarTarefaComoConcluidaUseCase'; 
import { ExcluirTarefaUseCase } from '../domain/usecases/ExcluirTarefaUseCase';
import { MockTarefaDataSource } from '../data/datasources/MockTarefaDataSource';
import { TarefaRepository } from '../data/repositories/TarefaRepository';
import { colors, spacing } from '../theme';
import { styles } from './styles';
import { RootStackParamList } from '..//navigation/AppNavigator';


const mockTarefaDataSource: TarefaRepository = new MockTarefaDataSource();
const buscarTarefasDoDiaUseCase = new BuscarTarefasDoDiaUseCase(mockTarefaDataSource);
const marcarTarefaComoConcluidaUseCase = new MarcarTarefaComoConcluidaUseCase(mockTarefaDataSource); 
const excluirTarefaUseCase = new ExcluirTarefaUseCase(mockTarefaDataSource);


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
    onToggle: (tarefa: Tarefa) => void; // CORREÇÃO 1: Recebe a tarefa inteira
    onDelete: (id: string) => void;
};

const TaskItem: React.FC<TaskItemProps> = ({ tarefa, onToggle, onDelete }) => {
    const isConcluida = tarefa.concluida;
    const priorityColor = tarefa.prioridade === 'urgente' ? colors.danger : colors.secondary;

    return (
        <View style={styles.taskItem}>
            <View style={[styles.priorityBar, { backgroundColor: priorityColor }]} />
            
            <View style={styles.taskContent}> {/* ESTILO CORRIGIDO */}
                <Text style={[styles.taskTitle, isConcluida && styles.taskTitleCompleted]}>
                    {tarefa.titulo}
                </Text>
                <Text style={styles.taskTime}>{tarefa.horario}</Text>
            </View>

            {/* AÇÕES */}
            <View style={styles.taskActions}> {/* ESTILO CORRIGIDO */}
                {/* 1. CHECKBOX */}
                <CheckBox
                    checked={isConcluida}
                    // CORREÇÃO 2: Passa a tarefa atualizada para o handleToggleTask
                    onPress={() => onToggle({ ...tarefa, concluida: !isConcluida })} 
                    containerStyle={styles.checkboxContainer}
                    checkedColor={colors.success}
                    uncheckedColor={colors.surface} // CORREÇÃO 3: Usando colors.surface
                />
                
                {/* 2. ÍCONE DE DELETAR */}
                <TouchableOpacity onPress={() => onDelete(tarefa.id_tarefa)} style={{ marginLeft: spacing.sm }}>
                    <Icon name="delete-forever" size={24} color={colors.danger} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

// =================================================================
// COMPONENTE PRINCIPAL: HOME SCREEN
// =================================================================
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(getCurrentTime());

    // Atualiza o relógio a cada segundo
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(getCurrentTime());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Função para carregar as tarefas
    const fetchTarefas = useCallback(async () => {
        setIsLoading(true);
        try {
            const today = new Date();
            const loadedTarefas = await buscarTarefasDoDiaUseCase.execute(today);
            setTarefas(loadedTarefas);
        } catch (error) {
            Alert.alert("Erro de Carga", "Não foi possível carregar as tarefas.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Carrega as tarefas ao montar a tela
    useEffect(() => {
        fetchTarefas();
    }, [fetchTarefas]);

    // Lógica para marcar/desmarcar tarefa
    // CORREÇÃO 4: Recebe a tarefa inteira (objeto)
    const handleToggleTask = async (tarefaAtualizada: Tarefa) => {
        
        // 1. Atualiza o estado localmente para feedback imediato
        setTarefas(currentTarefas =>
            currentTarefas.map(t =>
                t.id_tarefa === tarefaAtualizada.id_tarefa ? tarefaAtualizada : t
            )
        );

        // 2. Chama o Caso de Uso para persistir o status (Domain Layer)
        // O Caso de Uso deve ser implementado para aceitar o objeto Tarefa
        await marcarTarefaComoConcluidaUseCase.execute(tarefaAtualizada); 
    };

    // Lógica para excluir tarefa
    const handleDeleteTask = async (id_tarefa: string) => {
        try {
            // 1. Chama o Caso de Uso para deletar (Domain Layer)
            await excluirTarefaUseCase.execute(id_tarefa);
            
            // 2. Atualiza o estado local
            setTarefas(currentTarefas => currentTarefas.filter(t => t.id_tarefa !== id_tarefa));
            
            Alert.alert("Sucesso", "Tarefa excluída.");
        } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir a tarefa.");
        }
    };

    return (
        <View style={styles.container}>
            
            {/* HEADER: Relógio e Botão de Configurações */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.dateText}>{currentTime.date}</Text>
                    <Text style={styles.timeText}>{currentTime.time}</Text>
                </View>
                {/* Ícone de Configurações */}
                <TouchableOpacity onPress={() => Alert.alert("Funcionalidade", "Configurações da Sprint 3")}>
                    <Icon name="settings" size={30} color={colors.textLight} />
                </TouchableOpacity>
            </View>

            {/* ÁREA DE TAREFAS */}
            <View style={styles.tasksContainer}>
                <Text style={styles.sectionTitle}>Tarefas de hoje</Text>
                
                {/* Lógica de Carregamento e Renderização */}
                {isLoading ? (
                    <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />
                ) : (
                    <ScrollView contentContainerStyle={styles.tasksContentContainer}>
                        {tarefas.map(tarefa => (
                            <TaskItem 
                                key={tarefa.id_tarefa} 
                                tarefa={tarefa} 
                                onToggle={handleToggleTask} // Passa a função de toggle
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </ScrollView>
                )}
            </View>
            
            {/* FAB - Botão de Adicionar Tarefa */}
            <TouchableOpacity style={styles.fab} onPress={() => Alert.alert("Próximo Passo", "Navegar para Adicionar Tarefa")}>
                <Icon name="add" size={30} color={colors.textLight} />
            </TouchableOpacity>
        </View>
    );
};