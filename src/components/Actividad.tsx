// Actividad.tsx
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { Select, MenuItem, CircularProgress, Snackbar, Alert, FormControl, InputLabel } from '@mui/material';

interface ActividadData {
  id: number;
  nombre: string;
  id_etapa: number;
  id_tipo_actividad: number;
  etapa: {
    id: number;
    nombre: string;
  } | null;
  tipo_actividad: {
    id: number;
    nombre: string;
  } | null;
}

interface EtapaOption {
  id: number;
  nombre: string;
}

interface TipoActividadOption {
  id: number;
  nombre: string;
}

const Actividad: React.FC = () => {
  const [activitiesData, setActivitiesData] = useState<ActividadData[]>([]);
  const [etapas, setEtapas] = useState<EtapaOption[]>([]);
  const [tiposActividad, setTiposActividad] = useState<TipoActividadOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch all necessary data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [actividadesResponse, etapasResponse, tiposActividadResponse] = await Promise.all([
        fetch('http://localhost:4000/actividad'),
        fetch('http://localhost:4000/etapa'),
        fetch('http://localhost:4000/tipo-actividad')
      ]);

      if (!actividadesResponse.ok || !etapasResponse.ok || !tiposActividadResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [actividadesData, etapasData, tiposActividadData] = await Promise.all([
        actividadesResponse.json(),
        etapasResponse.json(),
        tiposActividadResponse.json()
      ]);

      // Adjust based on API response structure
      setActivitiesData(Array.isArray(actividadesData.records) ? actividadesData.records : actividadesData);
      setEtapas(Array.isArray(etapasData.records) ? etapasData.records : etapasData);
      setTiposActividad(Array.isArray(tiposActividadData.records) ? tiposActividadData.records : tiposActividadData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: Column[] = [
    { key: 'id', header: 'ID' },
    { key: 'nombre', header: 'Nombre' },
    { key: 'etapa', header: 'Etapa' },
    { key: 'tipoActividad', header: 'Tipo de Actividad' },
  ];

  const generateTableData = (data: ActividadData[]): Row[] => {
    return data.map((actividad) => ({
      id: actividad.id,
      nombre: actividad.nombre,
      etapa: actividad.etapa?.nombre || 'N/A',
      tipoActividad: actividad.tipo_actividad?.nombre || 'N/A',
      id_etapa: actividad.id_etapa, // Pass these IDs for use in formData
      id_tipo_actividad: actividad.id_tipo_actividad,
    }));
  };
  
  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/actividad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: newRow.nombre,
          id_etapa: Number(newRow.etapa), // Convert to number
          id_tipo_actividad: Number(newRow.tipoActividad), // Convert to number
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new actividad: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Actividad added successfully.');
      fetchData(); // Refetch all data to ensure consistency
    } catch (error) {
      console.error('Error adding new actividad:', error);
      setError(`Failed to add new actividad: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const actividadId = Number(editedRow.id);
      if (isNaN(actividadId)) {
        throw new Error('Invalid ID for editing.');
      }

      const response = await fetch(`http://localhost:4000/actividad/${actividadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: editedRow.nombre,
          id_etapa: Number(editedRow.etapa), // Convert to number
          id_tipo_actividad: Number(editedRow.tipoActividad), // Convert to number
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit actividad: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Actividad edited successfully.');
      fetchData(); // Refetch all data to ensure consistency
    } catch (error) {
      console.error('Error editing actividad:', error);
      setError(`Failed to edit actividad: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const actividadId = Number(id);
      if (isNaN(actividadId)) {
        throw new Error('Invalid ID for deletion.');
      }

      const response = await fetch(`http://localhost:4000/actividad/${actividadId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete actividad: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Actividad deleted successfully.');
      setActivitiesData(activitiesData.filter(actividad => actividad.id !== actividadId));
    } catch (error) {
      console.error('Error deleting actividad:', error);
      setError(`Failed to delete actividad: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const customInputs: CustomInputs = {
    etapa: (value: string, onChange: (value: string) => void) => (
      <FormControl fullWidth>
        <InputLabel id="etapa-label">Etapa</InputLabel>
        <Select
          labelId="etapa-label"
          value={value} // Use the ID value
          label="Etapa"
          onChange={(e) => onChange(e.target.value as string)}
        >
          {etapas.map(etapa => (
            <MenuItem key={etapa.id} value={etapa.id.toString()}>{etapa.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>
    ),
    tipoActividad: (value: string, onChange: (value: string) => void) => (
      <FormControl fullWidth>
        <InputLabel id="tipo-actividad-label">Tipo Actividad</InputLabel>
        <Select
          labelId="tipo-actividad-label"
          value={value} // Use the ID value
          label="Tipo Actividad"
          onChange={(e) => onChange(e.target.value as string)}
        >
          {tiposActividad.map(tipo => (
            <MenuItem key={tipo.id} value={tipo.id.toString()}>{tipo.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>
    ),
  };
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Actividades</h2>
      {/* Error Snackbar */}
      {error && (
        <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
      {/* Success Snackbar */}
      {success && (
        <Snackbar open={Boolean(success)} autoHideDuration={6000} onClose={() => setSuccess(null)}>
          <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
            {success}
          </Alert>
        </Snackbar>
      )}
      {/* Conditional Rendering Based on Data */}
      {activitiesData.length === 0 ? (
        <div>No activities found.</div>
      ) : (
        <SimpleTable
          columns={columns}
          data={generateTableData(activitiesData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="Actividad"
        />
      )}
    </div>
  );
};

export default Actividad;
