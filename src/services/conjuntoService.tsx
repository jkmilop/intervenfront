import ApiService from './apiService';

// Define the entity interface
interface Conjunto {
  id: number;
  nombre: string;
  residente_encargado: string;
  proyecto: string;

}

class ConjuntoService extends ApiService {
  constructor() {
    super(
      {
        baseURL: 'http://localhost:4000', // Update to your backend base URL
        timeout: 5000,
      },
      '/conjunto' // Define the specific endpoint for this entity
    );
  }

  // Fetch all Conjuntos
  getAllConjuntos(): Promise<Conjunto[]> {
    return this.fetchAll<Conjunto>();
  }

  // Fetch a single Conjunto by id
  getConjuntoById(id: number): Promise<Conjunto> {
    return this.fetchById<Conjunto>(id);
  }

  // Create a new Conjunto
  createConjunto(data: Conjunto): Promise<Conjunto> {
    return this.create<Conjunto>(data);
  }

  // Update an existing Conjunto
  updateConjunto(id: number, data: Partial<Conjunto>): Promise<Conjunto> {
    return this.update<Conjunto>(id, data);
  }

  // Delete an Conjunto by id
  deleteConjunto(id: number): Promise<void> {
    return this.delete(id);
  }
}

export default new ConjuntoService();
