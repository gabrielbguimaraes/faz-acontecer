// FazAcontecer/src/domain/usecases/AutenticarUsuarioUseCase.ts
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

        // Aqui, a lógica de negócio chama o repositório.
        await this.userRepository.login(email, password);
    }
}