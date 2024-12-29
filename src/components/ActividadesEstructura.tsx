
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface ActividadesestructuraData {
  id: number;
  id_actividad: number;
  id_estructura: number;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  id_reporte: number;
  id_estado: number;
  estructura: {
    nombre: string;
  };
  actividad: {
    nombre: string;
  };
  estado: {
    nombre: string;
  };
  reporte: {
    descripcion: string;
  };


}

const Actividadesestructura: React.FC = () => {
  const [actividadesestructurasData, setActividadesestructurasData] = useState<ActividadesestructuraData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/actividades-estructura');
      if (!response.ok) {
        throw new Error('Failed to fetch actividadesestructura data');
      }
      const data = await response.json();
      setActividadesestructurasData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching actividadesestructura data:', error);
      setError('Failed to fetch actividadesestructura data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: Column[] = [
    { key: 'id', header: 'id' },
    { key: 'id_actividad', header: 'id_actividad' },
    { key: 'id_estructura', header: 'id_estructura' },
    { key: 'descripcion', header: 'Descripcion' },
    { key: 'fecha_inicio', header: 'Fecha_inicio' },
    { key: 'fecha_fin', header: 'Fecha_fin' },
    { key: 'id_reporte', header: 'id_reporte' },
    { key: 'id_estado', header: 'id_estado' },
    { key: 'estructura', header: 'Estructura' },
    { key: 'estado', header: 'Estado' },

    { key: 'reporte', header: 'Reporte' },

    { key: 'actividad', header: 'Actividad' }
  ];

  const generateTableData = (data: ActividadesestructuraData[] = []): Row[] => {
    return data.map((actividadesestructura) => ({
      id: actividadesestructura.id, id_actividad: actividadesestructura.id_actividad, id_estructura: actividadesestructura.id_estructura, descripcion: actividadesestructura.descripcion, fecha_inicio: actividadesestructura.fecha_inicio, fecha_fin: actividadesestructura.fecha_fin, id_reporte: actividadesestructura.id_reporte, id_estado: actividadesestructura.id_estado, estructura: actividadesestructura.estructura.nombre, actividad: actividadesestructura.actividad.nombre
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/actividadesestructura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new actividadesestructura: ${errorData.message || 'Internal server error'}`);
      }

      const addedActividadesestructura: ActividadesestructuraData = await response.json();
      setSuccess('Actividadesestructura added successfully.');
      setActividadesestructurasData([...actividadesestructurasData, addedActividadesestructura]);
    } catch (error) {
      console.error('Error adding new actividadesestructura:', error);
      setError(`Failed to add new actividadesestructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const response = await fetch(`http://localhost:4000/actividadesestructura/${editedRow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit actividadesestructura: ${errorData.message || 'Internal server error'}`);
      }

      const updatedActividadesestructura: ActividadesestructuraData = await response.json();
      setSuccess('Actividadesestructura edited successfully.');
      setActividadesestructurasData(actividadesestructurasData.map(actividadesestructura => 
        actividadesestructura.id === updatedActividadesestructura.id ? updatedActividadesestructura : actividadesestructura
      ));
    } catch (error) {
      console.error('Error editing actividadesestructura:', error);
      setError(`Failed to edit actividadesestructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const response = await fetch(`http://localhost:4000/actividadesestructura/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete actividadesestructura: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Actividadesestructura deleted successfully.');
      setActividadesestructurasData(actividadesestructurasData.filter(actividadesestructura => actividadesestructura.id !== id));
    } catch (error) {
      console.error('Error deleting actividadesestructura:', error);
      setError(`Failed to delete actividadesestructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <h2>Actividades por estructuras</h2>
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
      {Boolean(actividadesestructurasData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(actividadesestructurasData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="Actividadesestructura"
        />
      ) : (
        <div>No actividadesestructuras found.</div>
      )}
    </div>
  );
};

export default Actividadesestructura;
