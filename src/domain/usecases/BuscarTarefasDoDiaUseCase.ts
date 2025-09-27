// FazAcontecer/src/domain/usecases/BuscarTarefasDoDiaUseCase.ts
import { TarefaRepository } from '../../data/repositories/TarefaRepository';
import { Tarefa } from '../entities/tarefa';

// O Repository ainda precisa ser criado (ver Passo 2), mas usamos a interface.
// O MockTarefaDataSource (ver Passo 3) será passado no construtor.

export class BuscarTarefasDoDiaUseCase {
    private tarefaRepository: TarefaRepository;

    // Recebendo a implementação do repositório no construtor (Injeção de Dependência)
    constructor(tarefaRepository: TarefaRepository) {
        this.tarefaRepository = tarefaRepository;
    }

    async execute(data: Date): Promise<Tarefa[]> {
        if (!data) {
            // Lógica de Domínio: Deve ter uma data para buscar
            throw new Error('A data para buscar as tarefas é obrigatória.');
        }

        // 1. Busca as tarefas (mockadas)
        const tarefas = await this.tarefaRepository.getTarefasDoDia(data);
        
        // 2. Lógica de Domínio: Ordena as tarefas por hora de execução (requisito de visibilidade)
        tarefas.sort((a, b) => (a.hora_execucao?.getTime() ?? 0) - (b.hora_execucao?.getTime() ?? 0));

        return tarefas;
    }
}