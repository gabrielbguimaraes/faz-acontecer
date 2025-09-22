export interface Anexo {
  id_anexo: string;
  id_tarefa: string;
  url: string;
  nome_arquivo?: string;
  tipo_anexo: 'imagem' | 'audio' | 'documento';
  data_upload: Date;
}