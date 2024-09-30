// Zona.tsx
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface ZonaData {
  id: number;
  nombre: string;
}

const Zona: React.FC = () => {
  const [zonasData, setZonaesData] = useState<ZonaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch Zona Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/zona');
      if (!response.ok) {
        throw new Error('Failed to fetch zona data');
      }
      const data = await response.json();

      if (Array.isArray(data.records)) {
        setZonaesData(data.records);
      } else if (Array.isArray(data)) {
        // In case the API returns data directly as an array
        setZonaesData(data);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching zona data:', error);
      setError('Failed to fetch zona data. Please try again later.');
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

  const generateTableData = (data: ZonaData[] = []): Row[] => {
    return data.map((zona) => ({
      id: zona.id,
      nombre: zona.nombre,
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/zona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new zona: ${errorData.message || 'Internal server error'}`);
      }

      const addedZona: ZonaData = await response.json();
      setSuccess('Zona added successfully.');
      setZonaesData([...zonasData, addedZona]);
    } catch (error) {
      console.error('Error adding new zona:', error);
      setError(`Failed to add new zona: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const zonaId = Number(editedRow.id);
      if (isNaN(zonaId)) {
        throw new Error('Invalid ID for editing.');
      }

      const response = await fetch(`http://localhost:4000/zona/${zonaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: editedRow.nombre }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit zona: ${errorData.message || 'Internal server error'}`);
      }

      const updatedZona: ZonaData = await response.json();
      setSuccess('Zona edited successfully.');
      setZonaesData(zonasData.map(zona => 
        zona.id === updatedZona.id ? updatedZona : zona
      ));
    } catch (error) {
      console.error('Error editing zona:', error);
      setError(`Failed to edit zona: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const zonaId = Number(id);
      if (isNaN(zonaId)) {
        throw new Error('Invalid ID for deletion.');
      }

      const response = await fetch(`http://localhost:4000/zona/${zonaId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete zona: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Zona deleted successfully.');
      setZonaesData(zonasData.filter(zona => zona.id !== zonaId));
    } catch (error) {
      console.error('Error deleting zona:', error);
      setError(`Failed to delete zona: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Since Zona only has 'nombre', no custom inputs are necessary
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
      <h2>Zonaes</h2>
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
      {zonasData.length === 0 ? (
        <div>No zonas found.</div>
      ) : (
        <SimpleTable
          columns={columns}
          data={generateTableData(zonasData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="Zona"
        />
      )}
    </div>
  );
};

export default Zona;
