// src/data/repositories/UserRepository.ts
import { Usuario } from '../../domain/entities/usuario';

export interface UserRepository {
  login(email: string, pass: string): Promise<Usuario | null>;
  logout(): Promise<void>;
  createAccount(email: string, pass: string): Promise<Usuario | null>;
  getUsuario(userId: string): Promise<Usuario | null>;
  adicionarPontos(userId: string, pontos: number): Promise<void>;
  
  // --- ADICIONE ESTAS DUAS LINHAS ---
  atualizarNome(userId: string, novoNome: string): Promise<void>;
  atualizarSenha(novaSenha: string): Promise<void>;
  // ----------------------------------
}