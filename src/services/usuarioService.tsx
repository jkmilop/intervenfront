import ApiService from './apiService';

// Define the entity interface
interface Usuario {
  id: number;
  nombre: string;
  empresa: string;
  rol: string;

}

class UsuarioService extends ApiService {
  constructor() {
    super(
      {
        baseURL: 'http://localhost:4000', // Update to your backend base URL
        timeout: 5000,
      },
      '/usuario' // Define the specific endpoint for this entity
    );
  }

  // Fetch all Usuarioes
  getAllUsuarios(): Promise<Usuario[]> {
    return this.fetchAll<Usuario>();
  }

  // Fetch a single Usuario by id
  getUsuarioById(id: number): Promise<Usuario> {
    return this.fetchById<Usuario>(id);
  }

  // Create a new Usuario
  createUsuario(data: Usuario): Promise<Usuario> {
    return this.create<Usuario>(data);
  }

  // Update an existing Usuario
  updateUsuario(id: number, data: Partial<Usuario>): Promise<Usuario> {
    return this.update<Usuario>(id, data);
  }

  // Delete an Usuario by id
  deleteUsuario(id: number): Promise<void> {
    return this.delete(id);
  }
}

export default new UsuarioService();
