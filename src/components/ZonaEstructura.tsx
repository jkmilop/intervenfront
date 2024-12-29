
// ZonaEstructura.tsx
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface ZonaEstructuraData {
  id: number;
  id_estructura: number;
  id_zona: number;
}

const ZonaEstructura: React.FC = () => {
  const [zonaestructurasData, setZonaEstructurasData] = useState<ZonaEstructuraData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch ZonaEstructura Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/zona-estructura');
      if (!response.ok) {
        throw new Error('Failed to fetch zonaestructura data');
      }
      const data = await response.json();

      if (Array.isArray(data.records)) {
        setZonaEstructurasData(data.records);
      } else if (Array.isArray(data)) {
        setZonaEstructurasData(data);
      } else {
        throw new Error('Unexpected data format');
      }
    } catch (error) {
      console.error('Error fetching zonaestructura data:', error);
      setError('Failed to fetch zonaestructura data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: Column[] = [
    { key: 'id', header: 'Id' },
    { key: 'id_estructura', header: 'Id_estructura' },
    { key: 'id_zona', header: 'Id_zona' }
  ];

  const generateTableData = (data: ZonaEstructuraData[] = []): Row[] => {
    return data.map((zonaestructura) => ({
      id: zonaestructura.id, id_estructura: zonaestructura.id_estructura, id_zona: zonaestructura.id_zona
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/zonaestructura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new zonaestructura: ${errorData.message || 'Internal server error'}`);
      }

      const addedZonaEstructura: ZonaEstructuraData = await response.json();
      setSuccess('ZonaEstructura added successfully.');
      setZonaEstructurasData([...zonaestructurasData, addedZonaEstructura]);
    } catch (error) {
      console.error('Error adding new zonaestructura:', error);
      setError(`Failed to add new zonaestructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const zonaestructuraId = Number(editedRow.id);
      if (isNaN(zonaestructuraId)) {
        throw new Error('Invalid ID for editing.');
      }

      const response = await fetch(`http://localhost:4000/zonaestructura/${editedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit zonaestructura: ${errorData.message || 'Internal server error'}`);
      }

      const updatedZonaEstructura: ZonaEstructuraData = await response.json();
      setSuccess('ZonaEstructura edited successfully.');
      setZonaEstructurasData(zonaestructurasData.map(zonaestructura => 
        zonaestructura.id === updatedZonaEstructura.id ? updatedZonaEstructura : zonaestructura
      ));
    } catch (error) {
      console.error('Error editing zonaestructura:', error);
      setError(`Failed to edit zonaestructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const zonaestructuraId = Number(id);
      if (isNaN(zonaestructuraId)) {
        throw new Error('Invalid ID for deletion.');
      }

      const response = await fetch(`http://localhost:4000/zonaestructura/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete zonaestructura: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('ZonaEstructura deleted successfully.');
      setZonaEstructurasData(zonaestructurasData.filter(zonaestructura => zonaestructura.id !== zonaestructuraId));
    } catch (error) {
      console.error('Error deleting zonaestructura:', error);
      setError(`Failed to delete zonaestructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <h2>ZonaEstructuras</h2>
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
      {Boolean(zonaestructurasData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(zonaestructurasData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="ZonaEstructura"
        />
      ) : (
        <div>No zonaestructuras found.</div>
      )}
    </div>
  );
};

export default ZonaEstructura;
