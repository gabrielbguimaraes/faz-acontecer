// FazAcontecer/src/data/repositories/UserRepository.ts

import { Usuario } from "../../domain/entities/usuario";

export interface UserRepository {
    login(email: string, pass: string): Promise<Usuario | null>;
    logout(): Promise<void>;

    createAccount(email: string, pass: string): Promise<Usuario | null>;
}