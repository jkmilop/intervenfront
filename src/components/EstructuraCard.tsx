import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import SimpleCard from './SimpleCard';

interface EstructuraData {
  id: number;
  id_conjunto: number;
  id_ubicacion_estructura: number;
  id_tipo_estructura: number;
  nombre: string;
  descripcion: string;
  conjunto: {
    nombre: string;
  };
  tipo_estructura: {
    nombre: string;
  };
  ubicacion_estructura: {
    nombre: string;
  };
}

const EstructuraCard: React.FC = () => {
  const [estructurasData, setEstructurasData] = useState<EstructuraData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/estructura');
      if (!response.ok) {
        throw new Error('Failed to fetch estructura data');
      }
      const data = await response.json();
      setEstructurasData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching estructura data:', error);
      setError('Failed to fetch estructura data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (editedData: EstructuraData) => {
    try {
      const response = await fetch(`http://localhost:4000/estructura/${editedData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit estructura: ${errorData.message || 'Internal server error'}`);
      }

      const updatedEstructura: EstructuraData = await response.json();
      setSuccess('Estructura edited successfully.');
      setEstructurasData(estructurasData.map(estructura => 
        estructura.id === updatedEstructura.id ? updatedEstructura : estructura
      ));
    } catch (error) {
      console.error('Error editing estructura:', error);
      setError(`Failed to edit estructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const response = await fetch(`http://localhost:4000/estructura/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete estructura: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Estructura deleted successfully.');
      setEstructurasData(estructurasData.filter(estructura => estructura.id !== id));
    } catch (error) {
      console.error('Error deleting estructura:', error);
      setError(`Failed to delete estructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const fields = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'conjunto', label: 'Conjunto' },
    { key: 'tipo_estructura', label: 'Tipo de Estructura' },
    { key: 'ubicacion_estructura', label: 'Ubicación' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Estructuras</h2>
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
      <Grid container spacing={2}>
        {estructurasData.map((estructura) => (
          <Grid item xs={12} sm={6} md={4} key={estructura.id}>
            <SimpleCard
              fields={fields}
              data={{
                ...estructura,
                conjunto: estructura.conjunto.nombre,
                tipo_estructura: estructura.tipo_estructura.nombre,
                ubicacion_estructura: estructura.ubicacion_estructura.nombre,
              }}
              onEdit={handleEdit}
              onDelete={handleDelete}
              title={estructura.nombre}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default EstructuraCard;