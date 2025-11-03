import { Usuario } from '../entities/usuario';
import { UserRepository } from '../../data/repositories/UserRepository'; // (Assumindo que sua interface está aqui)

export interface IBuscarUsuarioUseCase {
  execute(userId: string): Promise<Usuario | null>;
}

export class BuscarUsuarioUseCase implements IBuscarUsuarioUseCase {
  constructor(private readonly usuarioRepository: UserRepository) {}

  async execute(userId: string): Promise<Usuario | null> {
    // Vamos precisar adicionar o método 'getUsuario' no seu repositório
    return this.usuarioRepository.getUsuario(userId);
  }
}