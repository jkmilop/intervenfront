
// TipoVivienda.tsx
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface TipoViviendaData {
  id: number;
  nombre: string;
}

const TipoVivienda: React.FC = () => {
  const [tipoviviendasData, setTipoViviendasData] = useState<TipoViviendaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch TipoVivienda Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/tipo-vivienda');
      if (!response.ok) {
        throw new Error('Failed to fetch tipovivienda data');
      }
      const data = await response.json();

      if (Array.isArray(data.records)) {
        setTipoViviendasData(data.records);
      } else if (Array.isArray(data)) {
        setTipoViviendasData(data);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching tipovivienda data:', error);
      setError('Failed to fetch tipovivienda data. Please try again later.');
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

  const generateTableData = (data: TipoViviendaData[] = []): Row[] => {
    return data.map((tipovivienda) => ({
      id: tipovivienda.id, nombre: tipovivienda.nombre
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/tipovivienda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new tipovivienda: ${errorData.message || 'Internal server error'}`);
      }

      const addedTipoVivienda: TipoViviendaData = await response.json();
      setSuccess('TipoVivienda added successfully.');
      setTipoViviendasData([...tipoviviendasData, addedTipoVivienda]);
    } catch (error) {
      console.error('Error adding new tipovivienda:', error);
      setError(`Failed to add new tipovivienda: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const tipoviviendaId = Number(editedRow.id);
      if (isNaN(tipoviviendaId)) {
        throw new Error('Invalid ID for editing.');
      }

      const response = await fetch(`http://localhost:4000/tipovivienda/${editedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit tipovivienda: ${errorData.message || 'Internal server error'}`);
      }

      const updatedTipoVivienda: TipoViviendaData = await response.json();
      setSuccess('TipoVivienda edited successfully.');
      setTipoViviendasData(tipoviviendasData.map(tipovivienda => 
        tipovivienda.id === updatedTipoVivienda.id ? updatedTipoVivienda : tipovivienda
      ));
    } catch (error) {
      console.error('Error editing tipovivienda:', error);
      setError(`Failed to edit tipovivienda: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const tipoviviendaId = Number(id);
      if (isNaN(tipoviviendaId)) {
        throw new Error('Invalid ID for deletion.');
      }

      const response = await fetch(`http://localhost:4000/tipovivienda/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete tipovivienda: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('TipoVivienda deleted successfully.');
      setTipoViviendasData(tipoviviendasData.filter(tipovivienda => tipovivienda.id !== tipoviviendaId));
    } catch (error) {
      console.error('Error deleting tipovivienda:', error);
      setError(`Failed to delete tipovivienda: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <h2>TipoViviendas</h2>
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
      {Boolean(tipoviviendasData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(tipoviviendasData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="TipoVivienda"
        />
      ) : (
        <div>No tipoviviendas found.</div>
      )}
    </div>
  );
};

export default TipoVivienda;
