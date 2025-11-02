// FazAcontecer/src/domain/entities/tarefa.ts 

export type TipoRecorrencia = 'nao_repete' | 'diariamente' | 'semanalmente';

// NOVO: Define a estrutura do objeto de localização
export interface Localizacao {
  latitude: number;
  longitude: number;
  raio: number; // Raio em metros
}

export interface Tarefa {
    id_tarefa: string;
    id_usuario: string;
    titulo: string;
    descricao?: string;
    data_execucao: Date;
    hora_execucao: Date;
    concluida: boolean; 
    status: 'pendente' | 'concluida'; 
    prioridade: 'urgente' | 'importante' | 'opcional';
    recorrencia: TipoRecorrencia;

    // NOVO: Campo para o lembrete de localização
    localizacao?: Localizacao;
}