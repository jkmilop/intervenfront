
// TipoEstructura.tsx
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface TipoEstructuraData {
  id: number;
  nombre: string;
}

const TipoEstructura: React.FC = () => {
  const [tipoestructurasData, setTipoEstructurasData] = useState<TipoEstructuraData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch TipoEstructura Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/tipo-estructura');
      if (!response.ok) {
        throw new Error('Failed to fetch tipoestructura data');
      }
      const data = await response.json();

      if (Array.isArray(data.records)) {
        setTipoEstructurasData(data.records);
      } else if (Array.isArray(data)) {
        setTipoEstructurasData(data);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching tipoestructura data:', error);
      setError('Failed to fetch tipoestructura data. Please try again later.');
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

  const generateTableData = (data: TipoEstructuraData[] = []): Row[] => {
    return data.map((tipoestructura) => ({
      id: tipoestructura.id, nombre: tipoestructura.nombre
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/tipoestructura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new tipoestructura: ${errorData.message || 'Internal server error'}`);
      }

      const addedTipoEstructura: TipoEstructuraData = await response.json();
      setSuccess('TipoEstructura added successfully.');
      setTipoEstructurasData([...tipoestructurasData, addedTipoEstructura]);
    } catch (error) {
      console.error('Error adding new tipoestructura:', error);
      setError(`Failed to add new tipoestructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const tipoestructuraId = Number(editedRow.id);
      if (isNaN(tipoestructuraId)) {
        throw new Error('Invalid ID for editing.');
      }

      const response = await fetch(`http://localhost:4000/tipoestructura/${editedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit tipoestructura: ${errorData.message || 'Internal server error'}`);
      }

      const updatedTipoEstructura: TipoEstructuraData = await response.json();
      setSuccess('TipoEstructura edited successfully.');
      setTipoEstructurasData(tipoestructurasData.map(tipoestructura => 
        tipoestructura.id === updatedTipoEstructura.id ? updatedTipoEstructura : tipoestructura
      ));
    } catch (error) {
      console.error('Error editing tipoestructura:', error);
      setError(`Failed to edit tipoestructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const tipoestructuraId = Number(id);
      if (isNaN(tipoestructuraId)) {
        throw new Error('Invalid ID for deletion.');
      }

      const response = await fetch(`http://localhost:4000/tipoestructura/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete tipoestructura: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('TipoEstructura deleted successfully.');
      setTipoEstructurasData(tipoestructurasData.filter(tipoestructura => tipoestructura.id !== tipoestructuraId));
    } catch (error) {
      console.error('Error deleting tipoestructura:', error);
      setError(`Failed to delete tipoestructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <h2>TipoEstructuras</h2>
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
      {Boolean(tipoestructurasData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(tipoestructurasData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="TipoEstructura"
        />
      ) : (
        <div>No tipoestructuras found.</div>
      )}
    </div>
  );
};

export default TipoEstructura;
