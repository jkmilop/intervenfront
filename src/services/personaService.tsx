import ApiService from './apiService';

// Define the entity interface
interface Etapa {
    nombre: string;
}

interface TipoActividad {
    actividad: string;
}

interface Persona {
    id: number;
    nombre: string;
    id_etapa: number;
    id_tipo_actividad: number;
    etapa: Etapa; // Nueva propiedad
    tipo_actividad: TipoActividad; // Nueva propiedad
}
class PersonaService extends ApiService {
  constructor() {
    super(
      {
        baseURL: 'http://localhost:4000', // Update to your backend base URL
        timeout: 5000,
      },
      '/persona' // Define the specific endpoint for this entity
    );
  }

  // Fetch all Personas
  getAllPersonas(): Promise<Persona[]> {
    return this.fetchAll<Persona>();
  }

  // Fetch a single Persona by id
  getPersonaById(id: number): Promise<Persona> {
    return this.fetchById<Persona>(id);
  }

  // Create a new Persona
  createPersona(data: Persona): Promise<Persona> {
    return this.create<Persona>(data);
  }

  // Update an existing Persona
  updatePersona(id: number, data: Partial<Persona>): Promise<Persona> {
    return this.update<Persona>(id, data);
  }

  // Delete an Persona by id
  deletePersona(id: number): Promise<void> {
    return this.delete(id);
  }
}

export default new PersonaService();
