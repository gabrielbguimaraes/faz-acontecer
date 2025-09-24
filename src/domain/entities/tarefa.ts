export interface Tarefa {
  id_tarefa: string;
  id_usuario: string;
  titulo: string;
  descricao?: string;
  data_execucao?: Date;
  hora_execucao?: Date;
  status: 'pendente' | 'concluida';
  prioridade: 'urgente' | 'importante' | 'opcional';
  id_recorrencia?: string;
  id_localizacao?: string;
}