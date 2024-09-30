import React, { useEffect, useState } from 'react';
import Table from './Table';
import { GridColDef } from '@mui/x-data-grid';
import actividadService from '../services/actividadService'; // Use actividadService instead of apiService

// Define the interface for the actividad data
interface Actividad {
  id: number;
  nombre: string;
  etapa: string;
  tipo_actividad: string;

}

const GlobalActividades: React.FC = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]); // State for actividades data
  const [loading, setLoading] = useState<boolean>(true); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Fetch actividades data from the API endpoint on component mount
  useEffect(() => {
    const fetchActividades = async () => {
      try {
        setLoading(true); // Set loading state to true before the fetch
        const data = await actividadService.getAllActividades(); // Fetch data using actividadService
        setActividades(data); // Set fetched data to state
      } catch (err) {
        setError('Failed to fetch actividades'); // Set error message on failure
      } finally {
        setLoading(false); // Set loading state to false after the fetch
      }
    };

    fetchActividades();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Define the columns configuration for the DataGrid
  const columns: GridColDef[] = [
    { field: 'nombre', headerName: 'Nombre Actividad', width: 150 },
    { field: 'etapa', headerName: 'Etapa Actividad', width: 150 },
    { field: 'tipo_actividad', headerName: 'Tipo Actividad', width: 150 },

  ];

  return (
    <div>
      {error ? ( // Display error message if there is an error
        <p>{error}</p>
      ) : (
        <Table<Actividad>
          columns={columns}
          data={actividades}
          loading={loading}
          emptyMessage="No actividades available"
          className="global-actividades-table"
        />
      )}
    </div>
  );
};

export default GlobalActividades;
