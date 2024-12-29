
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface ConjuntoData {
  id: number;
  nombre: string;
  id_residente_encargado: number;
  id_proyecto: number;
  id_vivienda: number;
  residente_encargado: {
    nombre: string;
  };
  proyecto: {
    nombre: string;
  };
  tipo_vivienda: {
    nombre: string;
  };
}

const Conjunto: React.FC = () => {
  const [conjuntosData, setConjuntosData] = useState<ConjuntoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/conjunto');
      if (!response.ok) {
        throw new Error('Failed to fetch conjunto data');
      }
      const data = await response.json();
      setConjuntosData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching conjunto data:', error);
      setError('Failed to fetch conjunto data. Please try again later.');
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
    { key: 'id_residente_encargado', header: 'Id_residente_encargado' },
    { key: 'id_proyecto', header: 'Id_proyecto' },
    { key: 'id_vivienda', header: 'Id_vivienda' },
    { key: 'residente_encargado', header: 'Residente_encargado' },
    { key: 'proyecto', header: 'Proyecto' },
    { key: 'tipo_vivienda', header: 'Tipo_vivienda' }
  ];

  const generateTableData = (data: ConjuntoData[] = []): Row[] => {
    return data.map((conjunto) => ({
      id: conjunto.id, nombre: conjunto.nombre, id_residente_encargado: conjunto.id_residente_encargado, id_proyecto: conjunto.id_proyecto, id_vivienda: conjunto.id_vivienda, residente_encargado: conjunto.residente_encargado.nombre, proyecto: conjunto.proyecto.nombre, tipo_vivienda: conjunto.tipo_vivienda.nombre
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/conjunto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new conjunto: ${errorData.message || 'Internal server error'}`);
      }

      const addedConjunto: ConjuntoData = await response.json();
      setSuccess('Conjunto added successfully.');
      setConjuntosData([...conjuntosData, addedConjunto]);
    } catch (error) {
      console.error('Error adding new conjunto:', error);
      setError(`Failed to add new conjunto: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const response = await fetch(`http://localhost:4000/conjunto/${editedRow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit conjunto: ${errorData.message || 'Internal server error'}`);
      }

      const updatedConjunto: ConjuntoData = await response.json();
      setSuccess('Conjunto edited successfully.');
      setConjuntosData(conjuntosData.map(conjunto => 
        conjunto.id === updatedConjunto.id ? updatedConjunto : conjunto
      ));
    } catch (error) {
      console.error('Error editing conjunto:', error);
      setError(`Failed to edit conjunto: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const response = await fetch(`http://localhost:4000/conjunto/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete conjunto: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Conjunto deleted successfully.');
      setConjuntosData(conjuntosData.filter(conjunto => conjunto.id !== id));
    } catch (error) {
      console.error('Error deleting conjunto:', error);
      setError(`Failed to delete conjunto: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <h2>Conjuntos</h2>
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
      {Boolean(conjuntosData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(conjuntosData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="Conjunto"
        />
      ) : (
        <div>No conjuntos found.</div>
      )}
    </div>
  );
};

export default Conjunto;
