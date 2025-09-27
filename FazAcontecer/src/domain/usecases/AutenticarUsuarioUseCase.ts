// FazAcontecer/src/domain/usecases/AutenticarUsuarioUseCase.ts

import { UserRepository } from '../../data/repositories/UserRepository';
import { Usuario } from '../entities/usuario';

export class AutenticarUsuarioUseCase {
    constructor(private userRepository: UserRepository) {}

    /**
     * Executa a autenticação do usuário.
     * @param email O e-mail do usuário.
     * @param pass A senha do usuário.
     * @returns Uma Promise que resolve com o objeto Usuario em caso de sucesso, ou null em caso de falha.
     */
    async execute(email: string, pass: string): Promise<Usuario | null> {
        if (!email || !pass) {
            throw new Error('E-mail e senha são obrigatórios.');
        }

        if (!email.includes('@') || !email.includes('.')) {
            throw new Error('Formato de e-mail inválido.');
        }

        // A camada de dados (Repository) é quem faz o login e retorna o usuário ou nulo.
        // O UseCase simplesmente repassa essa informação para a tela.
        return this.userRepository.login(email, pass);
    }
}