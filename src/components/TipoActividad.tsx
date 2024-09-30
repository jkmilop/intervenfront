
// TipoActividad.tsx
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface TipoActividadData {
  id: number;
  actividad: string;
}

const TipoActividad: React.FC = () => {
  const [tipoactividadsData, setTipoActividadsData] = useState<TipoActividadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch TipoActividad Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/tipo-actividad');
      if (!response.ok) {
        throw new Error('Failed to fetch tipoactividad data');
      }
      const data = await response.json();

      if (Array.isArray(data.records)) {
        setTipoActividadsData(data.records);
      } else if (Array.isArray(data)) {
        setTipoActividadsData(data);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching tipoactividad data:', error);
      setError('Failed to fetch tipoactividad data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: Column[] = [
    { key: 'id', header: 'Id' },
    { key: 'actividad', header: 'Actividad' }
  ];

  const generateTableData = (data: TipoActividadData[] = []): Row[] => {
    return data.map((tipoactividad) => ({
      id: tipoactividad.id, actividad: tipoactividad.actividad
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/tipoactividad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new tipoactividad: ${errorData.message || 'Internal server error'}`);
      }

      const addedTipoActividad: TipoActividadData = await response.json();
      setSuccess('TipoActividad added successfully.');
      setTipoActividadsData([...tipoactividadsData, addedTipoActividad]);
    } catch (error) {
      console.error('Error adding new tipoactividad:', error);
      setError(`Failed to add new tipoactividad: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const tipoactividadId = Number(editedRow.id);
      if (isNaN(tipoactividadId)) {
        throw new Error('Invalid ID for editing.');
      }

      const response = await fetch(`http://localhost:4000/tipoactividad/${editedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit tipoactividad: ${errorData.message || 'Internal server error'}`);
      }

      const updatedTipoActividad: TipoActividadData = await response.json();
      setSuccess('TipoActividad edited successfully.');
      setTipoActividadsData(tipoactividadsData.map(tipoactividad => 
        tipoactividad.id === updatedTipoActividad.id ? updatedTipoActividad : tipoactividad
      ));
    } catch (error) {
      console.error('Error editing tipoactividad:', error);
      setError(`Failed to edit tipoactividad: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const tipoactividadId = Number(id);
      if (isNaN(tipoactividadId)) {
        throw new Error('Invalid ID for deletion.');
      }

      const response = await fetch(`http://localhost:4000/tipoactividad/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete tipoactividad: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('TipoActividad deleted successfully.');
      setTipoActividadsData(tipoactividadsData.filter(tipoactividad => tipoactividad.id !== tipoactividadId));
    } catch (error) {
      console.error('Error deleting tipoactividad:', error);
      setError(`Failed to delete tipoactividad: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <h2>TipoActividads</h2>
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
      {Boolean(tipoactividadsData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(tipoactividadsData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="TipoActividad"
        />
      ) : (
        <div>No tipoactividads found.</div>
      )}
    </div>
  );
};

export default TipoActividad;
