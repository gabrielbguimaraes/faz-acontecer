// FazAcontecer/src/theme/colors.ts

export const colors = {
  // 1. CORES PRINCIPAIS (Marca e Ação)
  primary: '#6DC0E0',     // O seu Azul Claro/Ciano - Ideal para botões, ícones e destaques principais.
  secondary: '#7789FF',   // O seu Roxo/Azul Indigo - Bom para categorias e acentos secundários.
  
  // 2. FUNDOS E SUPERFÍCIES (Garante o contraste do tema)
  backgroundDark: '#232325', // O seu Dark Grey/Quase Preto - Fundo principal da tela de Login e no Modo Noturno.
  backgroundLight: '#FFFFFF', // Branco puro para o corpo das telas (Daily Summary) e cards.
  surface: '#D9D9D9',         // O seu Light Grey - Ideal para fundos de inputs, separadores e elementos de superfície suaves.
  
  // 3. TEXTO
  textDark: '#232325',        // Texto Escuro - Usado em superfícies claras (brancas).
  textLight: '#FFFFFF',       // Texto Claro - Usado em fundos escuros.
  textSecondary: '#D1D1D1',   // Um tom de cinza mais suave para datas ou informações secundárias.

  // 4. STATUS (Com base nos seus códigos de status)
  danger: '#FF5F5F',          // O seu Soft Red - Mensagens de erro e botões de exclusão.
  success: '#34C759',         // Verde (Mantendo um padrão universal para Sucesso)
  warning: '#FF9500',         // Amarelo/Laranja (Mantendo um padrão universal para Alertas)
};