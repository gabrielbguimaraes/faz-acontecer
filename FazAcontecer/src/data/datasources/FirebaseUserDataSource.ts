import { UserRepository } from '../repositories/UserRepository';
import auth from '@react-native-firebase/auth';

export class FirebaseUserDataSource implements UserRepository {
    async login(email: string, password: string): Promise<void> {
        try {
            await auth().signInWithEmailAndPassword(email, password);
        } catch (error) {
            // Personalize as mensagens de erro para o usuário
            if (error instanceof Error && error.message.includes('auth/wrong-password')) {
                throw new Error('E-mail ou senha incorretos.');
            }
            if (error instanceof Error && error.message.includes('auth/invalid-email')) {
                throw new Error('Formato de e-mail inválido.');
            }
            throw new Error('Ocorreu um erro ao tentar fazer login. Tente novamente.');
        }
    }
}