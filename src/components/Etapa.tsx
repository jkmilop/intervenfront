
// Etapa.tsx
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface EtapaData {
  id: number;
  nombre: string;
  descripcion: string;
}

const Etapa: React.FC = () => {
  const [etapasData, setEtapasData] = useState<EtapaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch Etapa Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/etapa');
      if (!response.ok) {
        throw new Error('Failed to fetch etapa data');
      }
      const data = await response.json();

      if (Array.isArray(data.records)) {
        setEtapasData(data.records);
      } else if (Array.isArray(data)) {
        setEtapasData(data);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching etapa data:', error);
      setError('Failed to fetch etapa data. Please try again later.');
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

  const generateTableData = (data: EtapaData[] = []): Row[] => {
    return data.map((etapa) => ({
      id: etapa.id, nombre: etapa.nombre, descripcion: etapa.descripcion
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/etapa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new etapa: ${errorData.message || 'Internal server error'}`);
      }

      const addedEtapa: EtapaData = await response.json();
      setSuccess('Etapa added successfully.');
      setEtapasData([...etapasData, addedEtapa]);
    } catch (error) {
      console.error('Error adding new etapa:', error);
      setError(`Failed to add new etapa: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const etapaId = Number(editedRow.id);
      if (isNaN(etapaId)) {
        throw new Error('Invalid ID for editing.');
      }

      const response = await fetch(`http://localhost:4000/etapa/${editedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit etapa: ${errorData.message || 'Internal server error'}`);
      }

      const updatedEtapa: EtapaData = await response.json();
      setSuccess('Etapa edited successfully.');
      setEtapasData(etapasData.map(etapa => 
        etapa.id === updatedEtapa.id ? updatedEtapa : etapa
      ));
    } catch (error) {
      console.error('Error editing etapa:', error);
      setError(`Failed to edit etapa: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const etapaId = Number(id);
      if (isNaN(etapaId)) {
        throw new Error('Invalid ID for deletion.');
      }

      const response = await fetch(`http://localhost:4000/etapa/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete etapa: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Etapa deleted successfully.');
      setEtapasData(etapasData.filter(etapa => etapa.id !== etapaId));
    } catch (error) {
      console.error('Error deleting etapa:', error);
      setError(`Failed to delete etapa: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <h2>Etapas</h2>
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
      {Boolean(etapasData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(etapasData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="Etapa"
        />
      ) : (
        <div>No etapas found.</div>
      )}
    </div>
  );
};

export default Etapa;
