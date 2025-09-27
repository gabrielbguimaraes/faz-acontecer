// FazAcontecer/src/domain/usecases/ExcluirTarefaUseCase.ts
import { TarefaRepository } from '../../data/repositories/TarefaRepository';

export class ExcluirTarefaUseCase {
    private tarefaRepository: TarefaRepository;

    constructor(tarefaRepository: TarefaRepository) {
        this.tarefaRepository = tarefaRepository;
    }

    async execute(id_tarefa: string): Promise<void> {
        if (!id_tarefa) {
            throw new Error('ID da tarefa é obrigatório.');
        }
        await this.tarefaRepository.deleteTarefa(id_tarefa);
    }
}