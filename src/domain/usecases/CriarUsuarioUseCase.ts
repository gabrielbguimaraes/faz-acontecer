import { UserRepository } from '../../data/repositories/UserRepository';
import { Usuario } from '../entities/usuario';

export class CriarUsuarioUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(email: string, pass: string): Promise<Usuario | null> {
        if (!email || !pass) {
            throw new Error('E-mail e senha são obrigatórios.');
        }
        if (pass.length < 6) {
             throw new Error('A senha deve ter pelo menos 6 caracteres.');
        }
        return this.userRepository.createAccount(email, pass);
    }
}