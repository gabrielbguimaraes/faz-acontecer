// FazAcontecer/src/data/repositories/TarefaRepository.ts
import { Tarefa } from '../../domain/entities/tarefa';

export interface TarefaRepository {
    getTarefasDoDia(data: Date): Promise<Tarefa[]>;
    
    // MÉTODOS ADICIONAIS NECESSÁRIOS PELO CASO DE USO
    createTarefa(tarefa: Tarefa): Promise<Tarefa>;
    updateTarefa(tarefa: Tarefa): Promise<void>; 
    deleteTarefa(id_tarefa: string): Promise<void>;
}