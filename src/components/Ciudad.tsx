// Ciudad.tsx
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface CiudadData {
  id: number;
  nombre: string;
}

const Ciudad: React.FC = () => {
  const [ciudadesData, setCiudadesData] = useState<CiudadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch Ciudad Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/ciudad');
      if (!response.ok) {
        throw new Error('Failed to fetch ciudad data');
      }
      const data = await response.json();

      if (Array.isArray(data.records)) {
        setCiudadesData(data.records);
      } else if (Array.isArray(data)) {
        // In case the API returns data directly as an array
        setCiudadesData(data);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching ciudad data:', error);
      setError('Failed to fetch ciudad data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: Column[] = [
    { key: 'id', header: 'ID' },
    { key: 'nombre', header: 'Nombre' },
  ];

  const generateTableData = (data: CiudadData[] = []): Row[] => {
    return data.map((ciudad) => ({
      id: ciudad.id,
      nombre: ciudad.nombre,
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/ciudad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new ciudad: ${errorData.message || 'Internal server error'}`);
      }

      const addedCiudad: CiudadData = await response.json();
      setSuccess('Ciudad added successfully.');
      setCiudadesData([...ciudadesData, addedCiudad]);
    } catch (error) {
      console.error('Error adding new ciudad:', error);
      setError(`Failed to add new ciudad: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const ciudadId = Number(editedRow.id);
      if (isNaN(ciudadId)) {
        throw new Error('Invalid ID for editing.');
      }

      const response = await fetch(`http://localhost:4000/ciudad/${ciudadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: editedRow.nombre }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit ciudad: ${errorData.message || 'Internal server error'}`);
      }

      const updatedCiudad: CiudadData = await response.json();
      setSuccess('Ciudad edited successfully.');
      setCiudadesData(ciudadesData.map(ciudad => 
        ciudad.id === updatedCiudad.id ? updatedCiudad : ciudad
      ));
    } catch (error) {
      console.error('Error editing ciudad:', error);
      setError(`Failed to edit ciudad: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const ciudadId = Number(id);
      if (isNaN(ciudadId)) {
        throw new Error('Invalid ID for deletion.');
      }

      const response = await fetch(`http://localhost:4000/ciudad/${ciudadId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete ciudad: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Ciudad deleted successfully.');
      setCiudadesData(ciudadesData.filter(ciudad => ciudad.id !== ciudadId));
    } catch (error) {
      console.error('Error deleting ciudad:', error);
      setError(`Failed to delete ciudad: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Since Ciudad only has 'nombre', no custom inputs are necessary
  const customInputs: CustomInputs = {};

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Ciudades</h2>
      {/* Error Snackbar */}
      {error && (
        <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
      {/* Success Snackbar */}
      {success && (
        <Snackbar open={Boolean(success)} autoHideDuration={6000} onClose={() => setSuccess(null)}>
          <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      )}
      {/* Conditional Rendering Based on Data */}
      {ciudadesData.length === 0 ? (
        <div>No ciudades found.</div>
      ) : (
        <SimpleTable
          columns={columns}
          data={generateTableData(ciudadesData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="Ciudad"
        />
      )}
    </div>
  );
};

export default Ciudad;
