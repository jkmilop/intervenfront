
// Titulo.tsx
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface TituloData {
  id: number;
  indice: string;
  titulo: string;
}

const Titulo: React.FC = () => {
  const [titulosData, setTitulosData] = useState<TituloData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch Titulo Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/titulo');
      if (!response.ok) {
        throw new Error('Failed to fetch titulo data');
      }
      const data = await response.json();

      if (Array.isArray(data.records)) {
        setTitulosData(data.records);
      } else if (Array.isArray(data)) {
        setTitulosData(data);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching titulo data:', error);
      setError('Failed to fetch titulo data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: Column[] = [
    { key: 'id', header: 'Id' },
    { key: 'indice', header: 'Indice' },
    { key: 'titulo', header: 'Titulo' }
  ];

  const generateTableData = (data: TituloData[] = []): Row[] => {
    return data.map((titulo) => ({
      id: titulo.id, indice: titulo.indice, titulo: titulo.titulo
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/titulo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new titulo: ${errorData.message || 'Internal server error'}`);
      }

      const addedTitulo: TituloData = await response.json();
      setSuccess('Titulo added successfully.');
      setTitulosData([...titulosData, addedTitulo]);
    } catch (error) {
      console.error('Error adding new titulo:', error);
      setError(`Failed to add new titulo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const tituloId = Number(editedRow.id);
      if (isNaN(tituloId)) {
        throw new Error('Invalid ID for editing.');
      }

      const response = await fetch(`http://localhost:4000/titulo/${editedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit titulo: ${errorData.message || 'Internal server error'}`);
      }

      const updatedTitulo: TituloData = await response.json();
      setSuccess('Titulo edited successfully.');
      setTitulosData(titulosData.map(titulo => 
        titulo.id === updatedTitulo.id ? updatedTitulo : titulo
      ));
    } catch (error) {
      console.error('Error editing titulo:', error);
      setError(`Failed to edit titulo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const tituloId = Number(id);
      if (isNaN(tituloId)) {
        throw new Error('Invalid ID for deletion.');
      }

      const response = await fetch(`http://localhost:4000/titulo/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete titulo: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Titulo deleted successfully.');
      setTitulosData(titulosData.filter(titulo => titulo.id !== tituloId));
    } catch (error) {
      console.error('Error deleting titulo:', error);
      setError(`Failed to delete titulo: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <h2>Titulos</h2>
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
      {Boolean(titulosData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(titulosData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="Titulo"
        />
      ) : (
        <div>No titulos found.</div>
      )}
    </div>
  );
};

export default Titulo;
