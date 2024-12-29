
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface MaterialesestructuraData {
  id: number;
  id_material_construccion: number;
  id_estructura: number;
  descripcion: string;
  estructura: {
    nombre: string;
  };
  material_construccion: {
    nombre: string;
  };
}

const Materialesestructura: React.FC = () => {
  const [materialesestructurasData, setMaterialesestructurasData] = useState<MaterialesestructuraData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/materiales-estructura');
      if (!response.ok) {
        throw new Error('Failed to fetch materialesestructura data');
      }
      const data = await response.json();
      setMaterialesestructurasData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching materialesestructura data:', error);
      setError('Failed to fetch materialesestructura data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: Column[] = [
    { key: 'id', header: 'Id' },
    { key: 'id_material_construccion', header: 'Id_material_construccion' },
    { key: 'id_estructura', header: 'Id_estructura' },
    { key: 'descripcion', header: 'Descripcion' },
    { key: 'estructura', header: 'Estructura' },
    { key: 'material_construccion', header: 'Material_construccion' }
  ];

  const generateTableData = (data: MaterialesestructuraData[] = []): Row[] => {
    return data.map((materialesestructura) => ({
      id: materialesestructura.id, id_material_construccion: materialesestructura.id_material_construccion, id_estructura: materialesestructura.id_estructura, descripcion: materialesestructura.descripcion, estructura: materialesestructura.estructura.nombre, material_construccion: materialesestructura.material_construccion.nombre
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/materialesestructura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new materialesestructura: ${errorData.message || 'Internal server error'}`);
      }

      const addedMaterialesestructura: MaterialesestructuraData = await response.json();
      setSuccess('Materialesestructura added successfully.');
      setMaterialesestructurasData([...materialesestructurasData, addedMaterialesestructura]);
    } catch (error) {
      console.error('Error adding new materialesestructura:', error);
      setError(`Failed to add new materialesestructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const response = await fetch(`http://localhost:4000/materialesestructura/${editedRow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit materialesestructura: ${errorData.message || 'Internal server error'}`);
      }

      const updatedMaterialesestructura: MaterialesestructuraData = await response.json();
      setSuccess('Materialesestructura edited successfully.');
      setMaterialesestructurasData(materialesestructurasData.map(materialesestructura => 
        materialesestructura.id === updatedMaterialesestructura.id ? updatedMaterialesestructura : materialesestructura
      ));
    } catch (error) {
      console.error('Error editing materialesestructura:', error);
      setError(`Failed to edit materialesestructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const response = await fetch(`http://localhost:4000/materialesestructura/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete materialesestructura: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Materialesestructura deleted successfully.');
      setMaterialesestructurasData(materialesestructurasData.filter(materialesestructura => materialesestructura.id !== id));
    } catch (error) {
      console.error('Error deleting materialesestructura:', error);
      setError(`Failed to delete materialesestructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <h2>Materialesestructuras</h2>
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
      {Boolean(materialesestructurasData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(materialesestructurasData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="Materialesestructura"
        />
      ) : (
        <div>No materialesestructuras found.</div>
      )}
    </div>
  );
};

export default Materialesestructura;
