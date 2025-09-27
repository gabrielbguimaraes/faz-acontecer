// FazAcontecer/src/data/datasources/MockTarefaDataSource.ts

import { TarefaRepository } from '../repositories/TarefaRepository';
import { Tarefa } from '../../domain/entities/tarefa';

// Array de dados de teste (usamos let para poder modificá-lo)
let MOCK_TAREFAS: Tarefa[] = [
    // Seus mocks (garanta que todos os campos estão corretos aqui)
    { id_tarefa: '1', id_usuario: 'user1', titulo: 'Finalizar Protótipo no Figma', data_execucao: new Date(), hora_execucao: new Date(new Date().setHours(14, 0, 0, 0)), status: 'pendente', prioridade: 'urgente', concluida: false, horario: '14:00' },
    { id_tarefa: '2', id_usuario: 'user1', titulo: 'Configurar Firebase Auth', data_execucao: new Date(), hora_execucao: new Date(new Date().setHours(16, 30, 0, 0)), status: 'concluida', prioridade: 'importante', concluida: true, horario: '16:30' },
    { id_tarefa: '3', id_usuario: 'user1', titulo: 'Responder E-mails', data_execucao: new Date(), hora_execucao: new Date(new Date().setHours(11, 0, 0, 0)), status: 'pendente', prioridade: 'opcional', concluida: false, horario: '11:00' },
];

export class MockTarefaDataSource implements TarefaRepository {
    async getTarefasDoDia(data: Date): Promise<Tarefa[]> {
        await new Promise(resolve => setTimeout(() => resolve(null), 500)); 
        return MOCK_TAREFAS;
    }

    // CORREÇÃO AQUI: Garante que os campos de status sejam literais de string
    async createTarefa(tarefa: Tarefa): Promise<Tarefa> {
        await new Promise(resolve => setTimeout(() => resolve(null), 500));
        
        const newTarefa = { 
            ...tarefa, 
            id_tarefa: String(MOCK_TAREFAS.length + 1), // Gera um ID simples
            status: 'pendente' as const, // <-- NOVO: Força o tipo como literal
            concluida: false,
        };
        
        // CORREÇÃO: Força o objeto a ser do tipo Tarefa para resolver o erro
        MOCK_TAREFAS.push(newTarefa as Tarefa); 
        return newTarefa as Tarefa;
    }
    
    // ... (restante dos métodos)
    async updateTarefa(tarefa: Tarefa): Promise<void> {
        await new Promise(resolve => setTimeout(() => resolve(null), 500));
        
        const index = MOCK_TAREFAS.findIndex(t => t.id_tarefa === tarefa.id_tarefa);
        if (index !== -1) {
            MOCK_TAREFAS[index] = tarefa;
        }
    }

    async deleteTarefa(id_tarefa: string): Promise<void> {
        await new Promise(resolve => setTimeout(() => resolve(null), 500));
        MOCK_TAREFAS = MOCK_TAREFAS.filter(t => t.id_tarefa !== id_tarefa);
    }
}