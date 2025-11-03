// src/domain/usecases/AtualizarSenhaUsuarioUseCase.ts
import { UserRepository } from '../../data/repositories/UserRepository';

export interface IAtualizarSenhaUsuarioUseCase {
  execute(novaSenha: string): Promise<void>;
}

export class AtualizarSenhaUsuarioUseCase implements IAtualizarSenhaUsuarioUseCase {
  constructor(private readonly usuarioRepository: UserRepository) {}

  async execute(novaSenha: string): Promise<void> {
    if (!novaSenha || novaSenha.length < 6) {
      throw new Error('A senha deve ter no mínimo 6 caracteres.');
    }
    return this.usuarioRepository.atualizarSenha(novaSenha);
  }
}