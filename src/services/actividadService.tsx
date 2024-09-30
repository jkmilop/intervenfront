import ApiService from './apiService';

// Define the entity interface
interface Actividad {
  id: number;
  nombre: string;
  // Add other relevant fields here
}

class ActividadService extends ApiService {
  constructor() {
    super(
      {
        baseURL: 'http://localhost:4000', // Update to your backend base URL
        timeout: 5000,
      },
      '/actividad' // Define the specific endpoint for this entity
    );
  }

  // Fetch all actividades
  getAllActividades(): Promise<Actividad[]> {
    return this.fetchAll<Actividad>();
  }

  // Fetch a single actividad by id
  getActividadById(id: number): Promise<Actividad> {
    return this.fetchById<Actividad>(id);
  }

  // Create a new actividad
  createActividad(data: Actividad): Promise<Actividad> {
    return this.create<Actividad>(data);
  }

  // Update an existing actividad
  updateActividad(id: number, data: Partial<Actividad>): Promise<Actividad> {
    return this.update<Actividad>(id, data);
  }

  // Delete an actividad by id
  deleteActividad(id: number): Promise<void> {
    return this.delete(id);
  }
}

export default new ActividadService();
