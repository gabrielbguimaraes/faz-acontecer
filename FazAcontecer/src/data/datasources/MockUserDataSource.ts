// FazAcontecer/src/data/datasources/MockUserDataSource.ts

import { UserRepository } from '../repositories/UserRepository';


const MOCK_EMAIL = 'teste@teste.com';
const MOCK_PASSWORD = '123456';

export class MockUserDataSource implements UserRepository {
    async login(email: string, password: string): Promise<void> {
        // Simula uma espera de rede para dar um efeito mais real
        await new Promise(resolve => setTimeout(() => resolve(null), 1000)); 

        if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
            console.log('MOCK: Login bem-sucedido para o usuário de teste.');
            return;
        } else {
            throw new Error('Credenciais de teste inválidas. Use teste@teste.com e 123456.');
        }
    }
}