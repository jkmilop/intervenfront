
// Empresa.tsx
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface EmpresaData {
  id: number;
  nombre: string;
  descripcion: string;
}

const Empresa: React.FC = () => {
  const [empresasData, setEmpresasData] = useState<EmpresaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch Empresa Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/empresa');
      if (!response.ok) {
        throw new Error('Failed to fetch empresa data');
      }
      const data = await response.json();

      if (Array.isArray(data.records)) {
        setEmpresasData(data.records);
      } else if (Array.isArray(data)) {
        setEmpresasData(data);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching empresa data:', error);
      setError('Failed to fetch empresa data. Please try again later.');
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

  const generateTableData = (data: EmpresaData[] = []): Row[] => {
    return data.map((empresa) => ({
      id: empresa.id, nombre: empresa.nombre, descripcion: empresa.descripcion
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/empresa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new empresa: ${errorData.message || 'Internal server error'}`);
      }

      const addedEmpresa: EmpresaData = await response.json();
      setSuccess('Empresa added successfully.');
      setEmpresasData([...empresasData, addedEmpresa]);
    } catch (error) {
      console.error('Error adding new empresa:', error);
      setError(`Failed to add new empresa: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const empresaId = Number(editedRow.id);
      if (isNaN(empresaId)) {
        throw new Error('Invalid ID for editing.');
      }

      const response = await fetch(`http://localhost:4000/empresa/${editedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit empresa: ${errorData.message || 'Internal server error'}`);
      }

      const updatedEmpresa: EmpresaData = await response.json();
      setSuccess('Empresa edited successfully.');
      setEmpresasData(empresasData.map(empresa => 
        empresa.id === updatedEmpresa.id ? updatedEmpresa : empresa
      ));
    } catch (error) {
      console.error('Error editing empresa:', error);
      setError(`Failed to edit empresa: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const empresaId = Number(id);
      if (isNaN(empresaId)) {
        throw new Error('Invalid ID for deletion.');
      }

      const response = await fetch(`http://localhost:4000/empresa/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete empresa: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Empresa deleted successfully.');
      setEmpresasData(empresasData.filter(empresa => empresa.id !== empresaId));
    } catch (error) {
      console.error('Error deleting empresa:', error);
      setError(`Failed to delete empresa: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <h2>Empresas</h2>
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
      {Boolean(empresasData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(empresasData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="Empresa"
        />
      ) : (
        <div>No empresas found.</div>
      )}
    </div>
  );
};

export default Empresa;
