
// Rol.tsx
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface RolData {
  id: number;
  nombre: string;
  descripcion: string;
}

const Rol: React.FC = () => {
  const [rolsData, setRolsData] = useState<RolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch Rol Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/rol');
      if (!response.ok) {
        throw new Error('Failed to fetch rol data');
      }
      const data = await response.json();

      if (Array.isArray(data.records)) {
        setRolsData(data.records);
      } else if (Array.isArray(data)) {
        setRolsData(data);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching rol data:', error);
      setError('Failed to fetch rol data. Please try again later.');
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
    { key: 'descripcion', header: 'Descripcion' }
  ];

  const generateTableData = (data: RolData[] = []): Row[] => {
    return data.map((rol) => ({
      id: rol.id, nombre: rol.nombre, descripcion: rol.descripcion
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/rol', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new rol: ${errorData.message || 'Internal server error'}`);
      }

      const addedRol: RolData = await response.json();
      setSuccess('Rol added successfully.');
      setRolsData([...rolsData, addedRol]);
    } catch (error) {
      console.error('Error adding new rol:', error);
      setError(`Failed to add new rol: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const rolId = Number(editedRow.id);
      if (isNaN(rolId)) {
        throw new Error('Invalid ID for editing.');
      }

      const response = await fetch(`http://localhost:4000/rol/${editedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit rol: ${errorData.message || 'Internal server error'}`);
      }

      const updatedRol: RolData = await response.json();
      setSuccess('Rol edited successfully.');
      setRolsData(rolsData.map(rol => 
        rol.id === updatedRol.id ? updatedRol : rol
      ));
    } catch (error) {
      console.error('Error editing rol:', error);
      setError(`Failed to edit rol: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const rolId = Number(id);
      if (isNaN(rolId)) {
        throw new Error('Invalid ID for deletion.');
      }

      const response = await fetch(`http://localhost:4000/rol/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete rol: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Rol deleted successfully.');
      setRolsData(rolsData.filter(rol => rol.id !== rolId));
    } catch (error) {
      console.error('Error deleting rol:', error);
      setError(`Failed to delete rol: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <h2>Rols</h2>
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
      {Boolean(rolsData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(rolsData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="Rol"
        />
      ) : (
        <div>No rols found.</div>
      )}
    </div>
  );
};

export default Rol;
