export interface Usuario {
  id_usuario: string;
  nome: string;
  email: string;
  senha: string;
  biometria_id?: string;
  pontuacao: number;
  id_configuracao_tema?: string;
}