
import { TarefaRepository } from '../../data/repositories/TarefaRepository';
import { Tarefa } from '../entities/tarefa'; //

export class MarcarTarefaComoConcluidaUseCase {
    private tarefaRepository: TarefaRepository;

    constructor(tarefaRepository: TarefaRepository) {
        this.tarefaRepository = tarefaRepository;
    }


    async execute(tarefa: Tarefa): Promise<void> {
        

        if (!tarefa.id_tarefa) { 
            throw new Error('ID da tarefa é obrigatório para marcar como concluída.');
        }


        await this.tarefaRepository.updateTarefa(tarefa);
        
        console.log(`Tarefa ${tarefa.id_tarefa} marcada/atualizada (Mock).`);
    }
}