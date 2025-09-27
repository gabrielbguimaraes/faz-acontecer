// FazAcontecer/src/domain/usecases/CriarTarefaUseCase.ts
import { TarefaRepository } from '../../data/repositories/TarefaRepository';
import { Tarefa } from '../entities/tarefa';

export class CriarTarefaUseCase {
    private tarefaRepository: TarefaRepository;

    constructor(tarefaRepository: TarefaRepository) {
        this.tarefaRepository = tarefaRepository;
    }

    async execute(tarefa: Partial<Tarefa>): Promise<Tarefa> {
        if (!tarefa.titulo || !tarefa.data_execucao) {
            throw new Error('Título e Data de execução são obrigatórios.');
        }

        // Lógica de Domínio: Garante que os campos de status sejam definidos corretamente
        const novaTarefa: Tarefa = {
            ...tarefa as Tarefa, // Assume os campos existentes e preenche os obrigatórios
            id_tarefa: '', // Será preenchido pelo repositório (mock)
            id_usuario: 'user1', // Usuário mockado
            status: 'pendente',
            concluida: false,
            prioridade: tarefa.prioridade || 'opcional',
            horario: tarefa.hora_execucao ? new Date(tarefa.hora_execucao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '00:00',
        };

        return await this.tarefaRepository.createTarefa(novaTarefa);
    }
}