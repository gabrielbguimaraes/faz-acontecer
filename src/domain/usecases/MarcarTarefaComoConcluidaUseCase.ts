// src/domain/usecases/MarcarTarefaComoConcluidaUseCase.ts

import { TarefaRepository } from '../../data/repositories/TarefaRepository';
import { UserRepository } from '../../data/repositories/UserRepository';
import { Tarefa } from '../entities/tarefa';

// Interface (Define o que o UseCase faz)
export interface IMarcarTarefaComoConcluidaUseCase {
  execute(tarefa: Tarefa, userId: string): Promise<void>;
}

export class MarcarTarefaComoConcluidaUseCase implements IMarcarTarefaComoConcluidaUseCase {
  
  // --- CORREÇÃO ---
  // O construtor que define as propriedades 'this.tarefaRepository'
  // e 'this.usuarioRepository'.
  constructor(
    private readonly tarefaRepository: TarefaRepository,
    private readonly usuarioRepository: UserRepository
  ) {}
  // ----------------

  async execute(tarefa: Tarefa, userId: string): Promise<void> {
    
    // 1º: Marca a tarefa como concluída
    // --- CORREÇÃO ---
    // (Usa o método 'updateTarefa' que já existe na sua interface)
    await this.tarefaRepository.updateTarefa(tarefa);

    // 2º: Define sua regra de negócio para os pontos
    let pontosGanhos = 10; // Pontos base
    if (tarefa.prioridade === 'urgente') {
      pontosGanhos = 25;
    } else if (tarefa.prioridade === 'importante') {
      pontosGanhos = 15;
    }

    // 3º: Adiciona os pontos ao usuário
    // (Isso funcionará pois o 'usuarioRepository' tem 'adicionarPontos')
    await this.usuarioRepository.adicionarPontos(userId, pontosGanhos);

    // 4º (Opcional): Aqui você pode buscar o usuário, verificar o total de pontos
    // e chamar um `usuarioRepository.atualizarNivel(userId, novoNivel)`
  }
}