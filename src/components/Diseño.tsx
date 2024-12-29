
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface DiseñoData {
  id: number;
  id_tipo_diseño: number;
  descripcion_diseño: string;
  tipo_diseño: {
    nombre: string;
  };
}

const Diseño: React.FC = () => {
  const [diseñosData, setDiseñosData] = useState<DiseñoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/diseño');
      if (!response.ok) {
        throw new Error('Failed to fetch diseño data');
      }
      const data = await response.json();
      setDiseñosData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching diseño data:', error);
      setError('Failed to fetch diseño data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: Column[] = [
    { key: 'id', header: 'Id' },
    { key: 'id_tipo_diseño', header: 'Id_tipo_diseño' },
    { key: 'descripcion_diseño', header: 'Descripcion_diseño' },
    { key: 'tipo_diseño', header: 'Tipo_diseño' }
  ];

  const generateTableData = (data: DiseñoData[] = []): Row[] => {
    return data.map((diseño) => ({
      id: diseño.id, id_tipo_diseño: diseño.id_tipo_diseño, descripcion_diseño: diseño.descripcion_diseño, tipo_diseño: diseño.tipo_diseño.nombre
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/diseño', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new diseño: ${errorData.message || 'Internal server error'}`);
      }

      const addedDiseño: DiseñoData = await response.json();
      setSuccess('Diseño added successfully.');
      setDiseñosData([...diseñosData, addedDiseño]);
    } catch (error) {
      console.error('Error adding new diseño:', error);
      setError(`Failed to add new diseño: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const response = await fetch(`http://localhost:4000/diseño/${editedRow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit diseño: ${errorData.message || 'Internal server error'}`);
      }

      const updatedDiseño: DiseñoData = await response.json();
      setSuccess('Diseño edited successfully.');
      setDiseñosData(diseñosData.map(diseño => 
        diseño.id === updatedDiseño.id ? updatedDiseño : diseño
      ));
    } catch (error) {
      console.error('Error editing diseño:', error);
      setError(`Failed to edit diseño: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const response = await fetch(`http://localhost:4000/diseño/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete diseño: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Diseño deleted successfully.');
      setDiseñosData(diseñosData.filter(diseño => diseño.id !== id));
    } catch (error) {
      console.error('Error deleting diseño:', error);
      setError(`Failed to delete diseño: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <h2>Diseños</h2>
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
      {Boolean(diseñosData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(diseñosData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="Diseño"
        />
      ) : (
        <div>No diseños found.</div>
      )}
    </div>
  );
};

export default Diseño;
