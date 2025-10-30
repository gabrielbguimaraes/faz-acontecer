// FazAcontecer/src/data/datasources/FirebaseUserDataSource.ts

import auth from '@react-native-firebase/auth';
import { Usuario } from '../../domain/entities/usuario';
import { UserRepository } from '../repositories/UserRepository';

export class FirebaseUserDataSource implements UserRepository {
  async login(email: string, pass: string): Promise<Usuario | null> {
    try {
      const response = await auth().signInWithEmailAndPassword(email, pass);
      const user = response.user;

      return {
        id_usuario: user.uid,
        email: user.email!,
        nome: user.displayName || 'Usuário',
      };
    } catch (error) {
      console.error("Firebase Login Error: ", error);
      return null;
    }
  }

  async logout(): Promise<void> {
    await auth().signOut();
  }

  // --- NOVO MÉTODO ADICIONADO ---
  async createAccount(email: string, pass: string): Promise<Usuario | null> {
    try {
      const response = await auth().createUserWithEmailAndPassword(email, pass);
      const user = response.user;
      
      // Retorna o usuário recém-criado
      return {
        id_usuario: user.uid,
        email: user.email!,
        nome: user.displayName || 'Novo Usuário',
      };
    } catch (error: any) {
      // Trata erros comuns de cadastro
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Este e-mail já está em uso.');
      }
      if (error.code === 'auth/weak-password') {
        throw new Error('A senha é muito fraca. Use pelo menos 6 caracteres.');
      }
      console.error("Firebase Create Account Error: ", error);
      throw new Error('Não foi possível criar a conta.');
    }
  }
}