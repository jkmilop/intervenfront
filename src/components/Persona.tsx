import React, { useEffect, useState } from 'react';
import Table from './Table';
import { GridColDef } from '@mui/x-data-grid';
import PersonaService from '../services/personaService'; // Use PersonaService instead of apiService

// Define the interface for the Persona data
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
const GlobalPersonas: React.FC = () => {
  const [Personas, setPersonas] = useState<Persona[]>([]); // State for Personas data
  const [loading, setLoading] = useState<boolean>(true); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Fetch Personas data from the API endpoint on component mount
  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        setLoading(true); // Set loading state to true before the fetch
        const data = await PersonaService.getAllPersonas(); // Fetch data using PersonaService
        setPersonas(data); // Set fetched data to state
      } catch (err) {
        setError('Failed to fetch Personas'); // Set error message on failure
      } finally {
        setLoading(false); // Set loading state to false after the fetch
      }
    };

    fetchPersonas();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Define the columns configuration for the DataGrid
  const columns: GridColDef[] = [
    { field: 'nombre', headerName: 'Nombre Persona', width: 150 },
    { field: 'rol', headerName: 'Rol', width: 150 },
    { field: 'empresa', headerName: 'Empresa', width: 150 },

  ];

  return (
    <div>
      {error ? ( // Display error message if there is an error
        <p>{error}</p>
      ) : (
        <Table<Persona>
          columns={columns}
          data={Personas}
          loading={loading}
          emptyMessage="No Personas available"
          className="global-personas-table"
        />
      )}
    </div>
  );
};

export default GlobalPersonas;
