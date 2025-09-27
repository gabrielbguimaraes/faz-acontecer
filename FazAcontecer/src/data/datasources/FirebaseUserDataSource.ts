// FazAcontecer/src/data/datasources/FirebaseUserDataSource.ts

import auth from '@react-native-firebase/auth';
import { Usuario } from '../../domain/entities/usuario';
import { UserRepository } from '../repositories/UserRepository';

// EXPORTANDO A CLASSE CORRETA
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
      // Retorna nulo para indicar que o login falhou
      return null;
    }
  }

  async logout(): Promise<void> {
    await auth().signOut();
  }
}