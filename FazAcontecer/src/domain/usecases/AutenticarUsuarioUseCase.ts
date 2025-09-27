// FazAcontecer/src/domain/usecases/AutenticarUsuarioUseCase.ts (Ajustado)

import { UserRepository } from '../../data/repositories/UserRepository';

export class AutenticarUsuarioUseCase {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(email: string, password: string): Promise<void> {
        if (!email || !password) {
            throw new Error('E-mail e senha são obrigatórios.');
        }
        
        // Exemplo de Lógica de Domínio: Verificação de formato básico
        if (!email.includes('@') || !email.includes('.')) {
            throw new Error('Formato de e-mail inválido.');
        }

        // Chama a camada de dados para realizar o login
        await this.userRepository.login(email, password);
        
        // Se chegar aqui, o login foi bem-sucedido.
    }
}