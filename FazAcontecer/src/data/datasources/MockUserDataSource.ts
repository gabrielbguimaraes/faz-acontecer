// FazAcontecer/src/data/datasources/MockUserDataSource.ts

import { Usuario } from '../../domain/entities/usuario';
import { UserRepository } from '../repositories/UserRepository';

export class MockUserDataSource implements UserRepository {
  // CORRIGIDO: Retorno do método 'login' alinhado com a interface
  async login(email: string, pass: string): Promise<Usuario | null> {
    console.log(`Tentativa de login mock com: ${email}/${pass}`);
    if (email === 'teste@teste.com' && pass === '123456') {
      return {
        id_usuario: 'mock-user-id',
        nome: 'Usuário Mock',
        email: email,
      };
    }
    return null;
  }

  // CORRIGIDO: Adicionado método 'logout' que faltava
  async logout(): Promise<void> {
    console.log('Usuário mock deslogado.');
    // Em um mock, não precisamos fazer nada, apenas simular a ação.
    return Promise.resolve();
  }
}