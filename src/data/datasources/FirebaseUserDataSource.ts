// FazAcontecer/src/data/datasources/FirebaseUserDataSource.ts

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Usuario } from '../../domain/entities/usuario';
import { UserRepository } from '../repositories/UserRepository';

export class FirebaseUserDataSource implements UserRepository {
  
  /**
   * Loga o usuário e busca seus dados do Firestore.
   */
  async login(email: string, pass: string): Promise<Usuario | null> {
    try {
      const response = await auth().signInWithEmailAndPassword(email, pass);
      const user = response.user;

      // Busca o documento do usuário no Firestore para pegar os pontos/nível
      const userDoc = await firestore().collection('usuarios').doc(user.uid).get();

      if (!userDoc.exists()) {
        // Fallback para usuários antigos
        console.warn("Usuário logado mas sem documento no Firestore. Criando agora.");
        
        const novoUsuario: Usuario = {
          id_usuario: user.uid,
          email: user.email!,
          nome: user.displayName || 'Usuário',
          pontuacao: 0,
          nivel: 1,
        };
        await firestore().collection('usuarios').doc(user.uid).set(novoUsuario);
        return novoUsuario;
      }

      return userDoc.data() as Usuario;
    } catch (error) {
      console.error("Firebase Login Error: ", error);
      return null;
    }
  }

  async logout(): Promise<void> {
    await auth().signOut();
  }

  /**
   * Cria o usuário no Auth E cria o documento no Firestore.
   */
  async createAccount(email: string, pass: string): Promise<Usuario | null> {
    try {
      const response = await auth().createUserWithEmailAndPassword(email, pass);
      const user = response.user;
      
      const novoUsuario: Usuario = {
        id_usuario: user.uid,
        email: user.email!,
        nome: user.displayName || 'Novo Usuário',
        pontuacao: 0,
        nivel: 1,
      };

      await firestore().collection('usuarios').doc(user.uid).set(novoUsuario);
      return novoUsuario;

    } catch (error: any) {
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

  // --- MÉTODO 'getUsuario' (ADICIONADO) ---
  // Esta era a função que estava faltando e causando o erro
  /**
   * Busca um documento de usuário específico pelo ID.
   */
  async getUsuario(userId: string): Promise<Usuario | null> {
    try {
      const doc = await firestore().collection('usuarios').doc(userId).get();
      if (doc.exists()) {
        return doc.data() as Usuario;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      throw new Error("Não foi possível buscar os dados do usuário.");
    }
  }
  // ------------------------------------

  /**
   * Adiciona pontos (de forma atômica) ao usuário no Firestore.
   */
  async adicionarPontos(userId: string, pontos: number): Promise<void> {
    try {
      const userRef = firestore().collection('usuarios').doc(userId);
      
      await userRef.update({
        pontuacao: firestore.FieldValue.increment(pontos)
      });
      
    } catch (error) {
      console.error("Erro ao adicionar pontos:", error); 
      throw new Error("Não foi possível atualizar a pontuação do usuário.");
    }
  }
async atualizarNome(userId: string, novoNome: string): Promise<void> {
    const currentUser = auth().currentUser;

    if (!currentUser || currentUser.uid !== userId) {
      throw new Error("Usuário não autenticado corretamente.");
    }

    try {
      // 1. Atualiza no Firebase Authentication
      await currentUser.updateProfile({
        displayName: novoNome,
      });
      
      // 2. Atualiza no Firestore
      await firestore().collection('usuarios').doc(userId).update({
        nome: novoNome,
      });

    } catch (error) {
      console.error("Erro ao atualizar nome:", error);
      throw new Error("Não foi possível atualizar o nome.");
    }
  }

  /**
   * Atualiza a senha do usuário no Firebase Auth.
   */
  async atualizarSenha(novaSenha: string): Promise<void> {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      throw new Error("Usuário não autenticado.");
    }

    try {
      await currentUser.updatePassword(novaSenha);
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);
      // Erro comum: O login é muito antigo
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('Login muito antigo. Por favor, saia e entre novamente para alterar a senha.');
      }
      throw new Error("Não foi possível atualizar a senha.");
    }
  }

}
