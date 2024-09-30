
// MaterialConstruccion.tsx
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface MaterialConstruccionData {
  id: number;
  nombre: string;
  referencia: string;
  dimensiones: string;
}

const MaterialConstruccion: React.FC = () => {
  const [materialconstruccionsData, setMaterialConstruccionsData] = useState<MaterialConstruccionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch MaterialConstruccion Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/material-construccion');
      if (!response.ok) {
        throw new Error('Failed to fetch materialconstruccion data');
      }
      const data = await response.json();

      if (Array.isArray(data.records)) {
        setMaterialConstruccionsData(data.records);
      } else if (Array.isArray(data)) {
        setMaterialConstruccionsData(data);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching materialconstruccion data:', error);
      setError('Failed to fetch materialconstruccion data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: Column[] = [
    { key: 'id', header: 'Id' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'referencia', header: 'Referencia' },
    { key: 'dimensiones', header: 'Dimensiones' }
  ];

  const generateTableData = (data: MaterialConstruccionData[] = []): Row[] => {
    return data.map((materialconstruccion) => ({
      id: materialconstruccion.id, nombre: materialconstruccion.nombre, referencia: materialconstruccion.referencia, dimensiones: materialconstruccion.dimensiones
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/materialconstruccion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new materialconstruccion: ${errorData.message || 'Internal server error'}`);
      }

      const addedMaterialConstruccion: MaterialConstruccionData = await response.json();
      setSuccess('MaterialConstruccion added successfully.');
      setMaterialConstruccionsData([...materialconstruccionsData, addedMaterialConstruccion]);
    } catch (error) {
      console.error('Error adding new materialconstruccion:', error);
      setError(`Failed to add new materialconstruccion: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const materialconstruccionId = Number(editedRow.id);
      if (isNaN(materialconstruccionId)) {
        throw new Error('Invalid ID for editing.');
      }

      const response = await fetch(`http://localhost:4000/materialconstruccion/${editedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit materialconstruccion: ${errorData.message || 'Internal server error'}`);
      }

      const updatedMaterialConstruccion: MaterialConstruccionData = await response.json();
      setSuccess('MaterialConstruccion edited successfully.');
      setMaterialConstruccionsData(materialconstruccionsData.map(materialconstruccion => 
        materialconstruccion.id === updatedMaterialConstruccion.id ? updatedMaterialConstruccion : materialconstruccion
      ));
    } catch (error) {
      console.error('Error editing materialconstruccion:', error);
      setError(`Failed to edit materialconstruccion: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const materialconstruccionId = Number(id);
      if (isNaN(materialconstruccionId)) {
        throw new Error('Invalid ID for deletion.');
      }

      const response = await fetch(`http://localhost:4000/materialconstruccion/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete materialconstruccion: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('MaterialConstruccion deleted successfully.');
      setMaterialConstruccionsData(materialconstruccionsData.filter(materialconstruccion => materialconstruccion.id !== materialconstruccionId));
    } catch (error) {
      console.error('Error deleting materialconstruccion:', error);
      setError(`Failed to delete materialconstruccion: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <h2>MaterialConstruccions</h2>
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
      {Boolean(materialconstruccionsData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(materialconstruccionsData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="MaterialConstruccion"
        />
      ) : (
        <div>No materialconstruccions found.</div>
      )}
    </div>
  );
};

export default MaterialConstruccion;
