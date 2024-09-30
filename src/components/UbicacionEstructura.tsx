
// UbicacionEstructura.tsx
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface UbicacionEstructuraData {
  id: number;
  nombre: string;
}

const UbicacionEstructura: React.FC = () => {
  const [ubicacionestructurasData, setUbicacionEstructurasData] = useState<UbicacionEstructuraData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch UbicacionEstructura Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/ubicacion-estructura');
      if (!response.ok) {
        throw new Error('Failed to fetch ubicacionestructura data');
      }
      const data = await response.json();

      if (Array.isArray(data.records)) {
        setUbicacionEstructurasData(data.records);
      } else if (Array.isArray(data)) {
        setUbicacionEstructurasData(data);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching ubicacionestructura data:', error);
      setError('Failed to fetch ubicacionestructura data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: Column[] = [
    { key: 'id', header: 'Id' },
    { key: 'nombre', header: 'Nombre' }
  ];

  const generateTableData = (data: UbicacionEstructuraData[] = []): Row[] => {
    return data.map((ubicacionestructura) => ({
      id: ubicacionestructura.id, nombre: ubicacionestructura.nombre
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/ubicacionestructura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new ubicacionestructura: ${errorData.message || 'Internal server error'}`);
      }

      const addedUbicacionEstructura: UbicacionEstructuraData = await response.json();
      setSuccess('UbicacionEstructura added successfully.');
      setUbicacionEstructurasData([...ubicacionestructurasData, addedUbicacionEstructura]);
    } catch (error) {
      console.error('Error adding new ubicacionestructura:', error);
      setError(`Failed to add new ubicacionestructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const ubicacionestructuraId = Number(editedRow.id);
      if (isNaN(ubicacionestructuraId)) {
        throw new Error('Invalid ID for editing.');
      }

      const response = await fetch(`http://localhost:4000/ubicacionestructura/${editedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit ubicacionestructura: ${errorData.message || 'Internal server error'}`);
      }

      const updatedUbicacionEstructura: UbicacionEstructuraData = await response.json();
      setSuccess('UbicacionEstructura edited successfully.');
      setUbicacionEstructurasData(ubicacionestructurasData.map(ubicacionestructura => 
        ubicacionestructura.id === updatedUbicacionEstructura.id ? updatedUbicacionEstructura : ubicacionestructura
      ));
    } catch (error) {
      console.error('Error editing ubicacionestructura:', error);
      setError(`Failed to edit ubicacionestructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const ubicacionestructuraId = Number(id);
      if (isNaN(ubicacionestructuraId)) {
        throw new Error('Invalid ID for deletion.');
      }

      const response = await fetch(`http://localhost:4000/ubicacionestructura/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete ubicacionestructura: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('UbicacionEstructura deleted successfully.');
      setUbicacionEstructurasData(ubicacionestructurasData.filter(ubicacionestructura => ubicacionestructura.id !== ubicacionestructuraId));
    } catch (error) {
      console.error('Error deleting ubicacionestructura:', error);
      setError(`Failed to delete ubicacionestructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

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
      <h2>UbicacionEstructuras</h2>
      {error && (
        <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
      {success && (
        <Snackbar open={Boolean(success)} autoHideDuration={6000} onClose={() => setSuccess(null)}>
          <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      )}
      {Boolean(ubicacionestructurasData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(ubicacionestructurasData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="UbicacionEstructura"
        />
      ) : (
        <div>No ubicacionestructuras found.</div>
      )}
    </div>
  );
};

export default UbicacionEstructura;
