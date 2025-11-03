// src/domain/usecases/AtualizarNomeUsuarioUseCase.ts
import { UserRepository } from '../../data/repositories/UserRepository';

export interface IAtualizarNomeUsuarioUseCase {
  execute(userId: string, novoNome: string): Promise<void>;
}

export class AtualizarNomeUsuarioUseCase implements IAtualizarNomeUsuarioUseCase {
  constructor(private readonly usuarioRepository: UserRepository) {}

  async execute(userId: string, novoNome: string): Promise<void> {
    if (!novoNome) {
      throw new Error('O nome não pode estar em branco.');
    }
    return this.usuarioRepository.atualizarNome(userId, novoNome);
  }
}