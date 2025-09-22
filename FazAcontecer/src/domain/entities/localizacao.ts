export interface Localizacao {
  id_localizacao: string;
  latitude: number;
  longitude: number;
  endereco: string;
  raio_alerta?: number;
}