export interface EstatisticaDesempenho {
  id_estatistica: string;
  id_usuario: string;
  periodo_inicio: Date;
  periodo_fim: Date;
  total_concluidas: number;
  total_atrasadas: number;
  total_ignoradas: number;
  produtividade_score: number;
}