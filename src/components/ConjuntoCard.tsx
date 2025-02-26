import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Snackbar, Alert } from '@mui/material';
import SimpleCard from './SimpleCard';

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

const ConjuntoCard: React.FC = () => {
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

  const handleEdit = async (editedData: ConjuntoData) => {
    try {
      const response = await fetch(`http://localhost:4000/conjunto/${editedData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
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

  const fields = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo_vivienda', label: 'Tipo Vivienda' },
    { key: 'proyecto', label: 'Proyecto' }
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
      <Grid container spacing={2}>
        {conjuntosData.map((conjunto) => (
          <Grid item xs={12} sm={6} md={4} key={conjunto.id}>
            <SimpleCard
              fields={fields}
              data={{
                ...conjunto,
                proyecto: conjunto.proyecto.nombre,
                tipo_vivienda: conjunto.tipo_vivienda.nombre,

              }}
              onEdit={handleEdit}
              onDelete={handleDelete}
              title={conjunto.nombre}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ConjuntoCard;