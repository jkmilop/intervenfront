
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface ProyectoData {
  id: number;
  nombre: string;
  direccion: string;
  id_ciudad: number;
  ciudad: {
    nombre: string;
  };
}

const Proyecto: React.FC = () => {
  const [proyectosData, setProyectosData] = useState<ProyectoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/proyecto');
      if (!response.ok) {
        throw new Error('Failed to fetch proyecto data');
      }
      const data = await response.json();
      setProyectosData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching proyecto data:', error);
      setError('Failed to fetch proyecto data. Please try again later.');
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
    { key: 'direccion', header: 'Direccion' },
    { key: 'id_ciudad', header: 'Id_ciudad' },
    { key: 'ciudad', header: 'Ciudad' }
  ];

  const generateTableData = (data: ProyectoData[] = []): Row[] => {
    return data.map((proyecto) => ({
      id: proyecto.id, nombre: proyecto.nombre, direccion: proyecto.direccion, id_ciudad: proyecto.id_ciudad, ciudad: proyecto.ciudad.nombre
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/proyecto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new proyecto: ${errorData.message || 'Internal server error'}`);
      }

      const addedProyecto: ProyectoData = await response.json();
      setSuccess('Proyecto added successfully.');
      setProyectosData([...proyectosData, addedProyecto]);
    } catch (error) {
      console.error('Error adding new proyecto:', error);
      setError(`Failed to add new proyecto: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const response = await fetch(`http://localhost:4000/proyecto/${editedRow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit proyecto: ${errorData.message || 'Internal server error'}`);
      }

      const updatedProyecto: ProyectoData = await response.json();
      setSuccess('Proyecto edited successfully.');
      setProyectosData(proyectosData.map(proyecto => 
        proyecto.id === updatedProyecto.id ? updatedProyecto : proyecto
      ));
    } catch (error) {
      console.error('Error editing proyecto:', error);
      setError(`Failed to edit proyecto: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const response = await fetch(`http://localhost:4000/proyecto/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete proyecto: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Proyecto deleted successfully.');
      setProyectosData(proyectosData.filter(proyecto => proyecto.id !== id));
    } catch (error) {
      console.error('Error deleting proyecto:', error);
      setError(`Failed to delete proyecto: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <h2>Proyectos</h2>
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
      {Boolean(proyectosData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(proyectosData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="Proyecto"
        />
      ) : (
        <div>No proyectos found.</div>
      )}
    </div>
  );
};

export default Proyecto;
