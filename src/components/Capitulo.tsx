
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface CapituloData {
  id: number;
  id_titulo: number;
  indice: string;
  capitulo: string;
  titulo: {
    titulo: string;
  };
}

const Capitulo: React.FC = () => {
  const [capitulosData, setCapitulosData] = useState<CapituloData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/capitulo');
      if (!response.ok) {
        throw new Error('Failed to fetch capitulo data');
      }
      const data = await response.json();
      setCapitulosData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching capitulo data:', error);
      setError('Failed to fetch capitulo data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: Column[] = [
    { key: 'id', header: 'Id' },
    { key: 'id_titulo', header: 'Id_titulo' },
    { key: 'indice', header: 'Indice' },
    { key: 'capitulo', header: 'Capitulo' },
    { key: 'titulo', header: 'Titulo' }
  ];

  const generateTableData = (data: CapituloData[] = []): Row[] => {
    return data.map((capitulo) => ({
      id: capitulo.id, id_titulo: capitulo.id_titulo, indice: capitulo.indice, capitulo: capitulo.capitulo, titulo: capitulo.titulo.titulo
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/capitulo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new capitulo: ${errorData.message || 'Internal server error'}`);
      }

      const addedCapitulo: CapituloData = await response.json();
      setSuccess('Capitulo added successfully.');
      setCapitulosData([...capitulosData, addedCapitulo]);
    } catch (error) {
      console.error('Error adding new capitulo:', error);
      setError(`Failed to add new capitulo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const response = await fetch(`http://localhost:4000/capitulo/${editedRow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit capitulo: ${errorData.message || 'Internal server error'}`);
      }

      const updatedCapitulo: CapituloData = await response.json();
      setSuccess('Capitulo edited successfully.');
      setCapitulosData(capitulosData.map(capitulo => 
        capitulo.id === updatedCapitulo.id ? updatedCapitulo : capitulo
      ));
    } catch (error) {
      console.error('Error editing capitulo:', error);
      setError(`Failed to edit capitulo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const response = await fetch(`http://localhost:4000/capitulo/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete capitulo: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Capitulo deleted successfully.');
      setCapitulosData(capitulosData.filter(capitulo => capitulo.id !== id));
    } catch (error) {
      console.error('Error deleting capitulo:', error);
      setError(`Failed to delete capitulo: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <h2>Capitulos</h2>
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
      {Boolean(capitulosData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(capitulosData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="Capitulo"
        />
      ) : (
        <div>No capitulos found.</div>
      )}
    </div>
  );
};

export default Capitulo;
