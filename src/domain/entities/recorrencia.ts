export interface Recorrencia {
  id_recorrencia: string;
  tipo_repeticao: 'diaria' | 'semanal' | 'mensal' | 'personalizada';
  intervalo?: string;
  data_fim?: Date;
}