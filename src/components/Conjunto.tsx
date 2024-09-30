import React, { useEffect, useState } from 'react';
import Table from './Table';
import { GridColDef } from '@mui/x-data-grid';
import ConjuntoService from '../services/conjuntoService'; // Use ConjuntoService instead of apiService

// Define the interface for the Conjunto data
interface Conjunto {
    id: number;
    nombre: string;
    residente_encargado: string;
    proyecto: string;
  
  }
  
const Conjunto: React.FC = () => {
  const [Conjuntos, setConjuntos] = useState<Conjunto[]>([]); // State for Conjuntos data
  const [loading, setLoading] = useState<boolean>(true); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Fetch Conjuntos data from the API endpoint on component mount
  useEffect(() => {
    const fetchConjuntos = async () => {
      try {
        setLoading(true); // Set loading state to true before the fetch
        const data = await ConjuntoService.getAllConjuntos(); // Fetch data using ConjuntoService
        setConjuntos(data); // Set fetched data to state
      } catch (err) {
        setError('Failed to fetch Conjuntos'); // Set error message on failure
      } finally {
        setLoading(false); // Set loading state to false after the fetch
      }
    };

    fetchConjuntos();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Define the columns configuration for the DataGrid
  const columns: GridColDef[] = [
    { field: 'nombre', headerName: 'Nombre Conjunto', width: 150 },
    { field: 'proyecto', headerName: 'Proyecto', width: 150 },
    { field: 'residente_encargado', headerName: 'Residente Encargado', width: 150 },

  ];

  return (
    <div>
      {error ? ( // Display error message if there is an error
        <p>{error}</p>
      ) : (
        <Table<Conjunto>
          columns={columns}
          data={Conjuntos}
          loading={loading}
          emptyMessage="No Conjuntos available"
          className="global-Conjuntos-table"
        />
      )}
    </div>
  );
};

export default Conjunto;
