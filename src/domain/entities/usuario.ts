// src/domain/entities/usuario.ts

export interface Usuario {
  id_usuario: string;
  nome: string;
  email: string;
  // senha: string; <-- REMOVIDO! Senha não deve ser salva no banco de dados.
  biometria_id?: string;
  
  // --- Padronização da Gamificação ---
  pontuacao: number; // <-- Este será o campo OFICIAL de pontos.
  nivel: number;     // <-- Este será o campo OFICIAL de nível.
  // ------------------------------------
  
  id_configuracao_tema?: string;
  
  // Os campos 'pontos' e 'nivel' (opcionais) foram removidos
  // para evitar confusão com 'pontuacao' e 'nivel' (obrigatórios).
}