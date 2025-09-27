// FazAcontecer/src/data/datasources/FirebaseTarefaDataSource.ts

import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Tarefa } from '../../domain/entities/tarefa';
import { TarefaRepository } from '../repositories/TarefaRepository';

export class FirebaseTarefaDataSource implements TarefaRepository {
  private getUserId(): string {
    const user = auth().currentUser;
    if (!user) {
      throw new Error('Nenhum usuário autenticado.');
    }
    return user.uid;
  }

  private tarefasCollection() {
    const userId = this.getUserId();
    return firestore().collection('usuarios').doc(userId).collection('tarefas');
  }

  async getTarefasDoDia(data: Date): Promise<Tarefa[]> {
    const startOfDay = new Date(data);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(data);
    endOfDay.setHours(23, 59, 59, 999);

    const snapshot = await this.tarefasCollection()
      .where('data_execucao', '>=', startOfDay)
      .where('data_execucao', '<=', endOfDay)
      .get();

    return snapshot.docs.map(doc => {
      const docData = doc.data();
      return {
        ...docData,
        id_tarefa: doc.id,
        data_execucao: (docData.data_execucao as FirebaseFirestoreTypes.Timestamp).toDate(),
        hora_execucao: (docData.hora_execucao as FirebaseFirestoreTypes.Timestamp).toDate(),
      } as Tarefa;
    });
  }

  async createTarefa(tarefa: Partial<Tarefa>): Promise<Tarefa> {
    if (!tarefa.data_execucao || !tarefa.hora_execucao) {
        throw new Error("Data e hora da tarefa são obrigatórias para a criação.");
    }

    const docRef = await this.tarefasCollection().add({
      ...tarefa,
      data_execucao: firestore.Timestamp.fromDate(tarefa.data_execucao),
      hora_execucao: firestore.Timestamp.fromDate(tarefa.hora_execucao),
      concluida: false,
      criado_em: firestore.FieldValue.serverTimestamp(),
    });

    const novaTarefaSnapshot = await docRef.get();
    const data = novaTarefaSnapshot.data();

    if (!data) {
      throw new Error("Não foi possível criar a tarefa no banco de dados.");
    }

    return {
      ...data,
      id_tarefa: docRef.id,
      data_execucao: (data.data_execucao as FirebaseFirestoreTypes.Timestamp).toDate(),
      hora_execucao: (data.hora_execucao as FirebaseFirestoreTypes.Timestamp).toDate(),
    } as Tarefa;
  }
  
  async updateTarefa(tarefa: Tarefa): Promise<void> {
    // CORREÇÃO: Verificação para garantir que as datas não são nulas antes de atualizar.
    if (!tarefa.data_execucao || !tarefa.hora_execucao) {
        throw new Error("Não é possível atualizar uma tarefa sem data ou hora de execução.");
    }
    
    await this.tarefasCollection().doc(tarefa.id_tarefa).update({
      ...tarefa,
      data_execucao: firestore.Timestamp.fromDate(tarefa.data_execucao),
      hora_execucao: firestore.Timestamp.fromDate(tarefa.hora_execucao),
    });
  }

  async deleteTarefa(id_tarefa: string): Promise<void> {
    await this.tarefasCollection().doc(id_tarefa).delete();
  }
}