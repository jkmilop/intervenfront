// Estructura.tsx
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { Select, MenuItem, CircularProgress, Snackbar, Alert, FormControl, InputLabel } from '@mui/material';
import SimpleModal from './SimpleModal';
import Reporte from './Reporte';

interface EstructuraData {
  id: number;
  nombre: string;
  id_conjunto: number;
  id_tipo_estructura: number;
  id_estado: number;

  conjunto: {
    id: number;
    nombre: string;
  } | null;
  estado: {
    id: number;
    nombre: string;
  } | null;

  tipo_estructura: {
    id: number;
    nombre: string;
  } | null;
}

interface ConjuntoOption {
  id: number;
  nombre: string;
}

interface TipoEstructuraOption {
  id: number;
  nombre: string;
}
interface EstadoOption {
  id: number;
  nombre: string;
}

const Estructura: React.FC = () => {
  const [activitiesData, setActivitiesData] = useState<EstructuraData[]>([]);
  const [conjuntos, setConjuntos] = useState<ConjuntoOption[]>([]);
  const [estados, setEstados] = useState<EstadoOption[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [tiposEstructura, setTiposEstructura] = useState<TipoEstructuraOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch all necessary data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [estructurasResponse, conjuntosResponse, tiposEstructuraResponse, estadoResponse] = await Promise.all([
        fetch('http://localhost:4000/estructura'),
        fetch('http://localhost:4000/conjunto'),
        fetch('http://localhost:4000/estado'),
        fetch('http://localhost:4000/tipo-estructura')
      ]);

      if (!estructurasResponse.ok || !conjuntosResponse.ok || !tiposEstructuraResponse.ok || !estadoResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [estructurasData, conjuntosData, tiposEstructuraData, estadosData] = await Promise.all([
        estructurasResponse.json(),
        conjuntosResponse.json(),
        estadoResponse.json(),
        tiposEstructuraResponse.json()
      ]);

      // Adjust based on API response structure
      setActivitiesData(Array.isArray(estructurasData.records) ? estructurasData.records : estructurasData);
      setConjuntos(Array.isArray(conjuntosData.records) ? conjuntosData.records : conjuntosData);
      setEstados(Array.isArray(estadosData.records) ? estadosData.records : estadosData);
      setTiposEstructura(Array.isArray(tiposEstructuraData.records) ? tiposEstructuraData.records : tiposEstructuraData);
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
    { key: 'conjunto', header: 'Conjunto' },
    { key: 'estado', header: 'Estado' },
    { key: 'tipo_estructura', header: 'Tipo de Estructura' },
  ];

  const generateTableData = (data: EstructuraData[]): Row[] => {
    return data.map((estructura) => ({
      id: estructura.id,
      nombre: estructura.nombre,
      conjunto: estructura.conjunto?.nombre || 'N/A',
      tipo_estructura: estructura.tipo_estructura?.nombre || 'N/A',
      estado: estructura.estado?.nombre || 'N/A',
      id_estado: estructura.id_estado, // Pass these IDs for use in formData

      id_conjunto: estructura.id_conjunto, // Pass these IDs for use in formData
      id_tipo_estructura: estructura.id_tipo_estructura,
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      // First POST request to add new 'estructura'
      const response = await fetch('http://localhost:4000/estructura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: newRow.nombre,
          id_conjunto: Number(newRow.conjunto), // Convert to number
          id_tipo_estructura: Number(newRow.tipo_estructura), // Convert to number

        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new estructura: ${errorData.message || 'Internal server error'}`);
      }

      // Extract the newly created 'estructura' ID from the response
      const responseData = await response.json();
      const estructuraId = responseData.id; // Assuming the API response contains the 'id'
      console.log(responseData);
      // Second POST request to the /generar endpoint using the retrieved estructuraId
      const generarResponse = await fetch(`http://localhost:4000/estructura/generar/${estructuraId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!generarResponse.ok) {
        const errorData = await generarResponse.json();
        throw new Error(`Failed to generate estructura: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Estructura added and generated successfully.');
      fetchData(); // Refetch all data to ensure consistency
    } catch (error) {
      console.error('Error adding or generating estructura:', error);
      setError(`Failed to add or generate estructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const estructuraId = Number(editedRow.id);
      if (isNaN(estructuraId)) {
        throw new Error('Invalid ID for editing.');
      }

      const response = await fetch(`http://localhost:4000/estructura/${estructuraId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: editedRow.nombre,
          id_conjunto: Number(editedRow.conjunto), // Convert to number
          id_tipo_estructura: Number(editedRow.tipo_estructura), // Convert to number
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit estructura: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Estructura edited successfully.');
      fetchData(); // Refetch all data to ensure consistency
    } catch (error) {
      console.error('Error editing estructura:', error);
      setError(`Failed to edit estructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const estructuraId = Number(id);
      if (isNaN(estructuraId)) {
        throw new Error('Invalid ID for deletion.');
      }

      const response = await fetch(`http://localhost:4000/estructura/${estructuraId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete estructura: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Estructura deleted successfully.');
      setActivitiesData(activitiesData.filter(estructura => estructura.id !== estructuraId));
    } catch (error) {
      console.error('Error deleting estructura:', error);
      setError(`Failed to delete estructura: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleModal = async (rowId: number | string) => {
    try {
      const response = await fetch(`http://localhost:4000/estructura/actividad/${rowId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch modal data');
      }
      const data = await response.json();
      const { id_reporte, ...rest } = data;
      setModalData({ ...rest, id_reporte });
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching modal data:', error);
    }
  };

  const handleSaveReporte = async (updatedData: Row, reportId: any) => {
    try {
      // Llama a handleEdit para actualizar el reporte
      await handleEdit({ ...updatedData, id: reportId });
      setSuccess('Reporte actualizado correctamente.');
      closeModal();
    } catch (err) {
      console.error('Error saving reporte:', err);
      setError('Error al guardar el reporte.');
    }
  };
  const handleReporte = async (estructuraId: number) => {
    try {
      // Fetch the report data for the given estructuraId
      const reportResponse = await fetch(`http://localhost:4000/estructura/reporte/${estructuraId}`);
      if (!reportResponse.ok) {
        throw new Error('Failed to fetch report data.');
      }

      const reportData = await reportResponse.json();

      // Fetch data for dropdowns
      const [interventoresResponse, resultadosResponse] = await Promise.all([
        fetch('http://localhost:4000/persona'),
        fetch('http://localhost:4000/resultado'),
      ]);

      if (!interventoresResponse.ok || !resultadosResponse.ok) {
        throw new Error('Failed to fetch data for dropdowns.');
      }

      const [interventoresData, resultadosData] = await Promise.all([
        interventoresResponse.json(),
        resultadosResponse.json(),
      ]);

      // Populate modal data with report data and dropdown options
      setModalData({
        report: reportData,
        interventores: Array.isArray(interventoresData) ? interventoresData : [],
        resultados: Array.isArray(resultadosData) ? resultadosData : [],
      });

      setModalOpen(true);
    } catch (error) {
      console.error('Error in handleReporte:', error);
      setError('Failed to fetch or process report data.');
    }
  };


  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
  };


  const customInputs: CustomInputs = {
    conjunto: (value: string, onChange: (value: string) => void) => (
      <FormControl fullWidth>
        <InputLabel id="conjunto-label">Conjunto</InputLabel>
        <Select
          labelId="conjunto-label"
          value={value} // Use the ID value
          label="Conjunto"
          onChange={(e) => onChange(e.target.value as string)}
        >
          {conjuntos.map(conjunto => (
            <MenuItem key={conjunto.id} value={conjunto.id.toString()}>{conjunto.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>
    ),
    estado: (value: string, onChange: (value: string) => void) => (
      <FormControl fullWidth>
        <InputLabel id="estado-label">estado</InputLabel>
        <Select
          labelId="estado-label"
          value={value} // Use the ID value
          label="Estado"
          onChange={(e) => onChange(e.target.value as string)}
        >
          {estados.map(estado => (
            <MenuItem key={estado.id} value={estado.id.toString()}>{estado.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>
    ),

    tipo_estructura: (value: string, onChange: (value: string) => void) => (
      <FormControl fullWidth>
        <InputLabel id="tipo-estructura-label">Tipo Estructura</InputLabel>
        <Select
          labelId="tipo-estructura-label"
          value={value} // Use the ID value
          label="Tipo Estructura"
          onChange={(e) => onChange(e.target.value as string)}
        >
          {tiposEstructura.map(tipo => (
            <MenuItem key={tipo.id} value={tipo.id.toString()}>{tipo.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>
    ),
    id_interventor: (value: string, onChange: (value: string) => void) => (
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as string)}
        fullWidth
      >
        {modalData?.interventores.map((interventor: any) => (
          <MenuItem key={interventor.id} value={interventor.id}>
            {interventor.nombre}
          </MenuItem>
        ))}
      </Select>
    ),
    id_resultado: (value: string, onChange: (value: string) => void) => (
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as string)}
        fullWidth
      >
        {modalData?.resultados.map((resultado: any) => (
          <MenuItem key={resultado.id} value={resultado.id}>
            {resultado.nombre}
          </MenuItem>
        ))}
      </Select>
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
      <h2>Estructuras</h2>
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
      {/* Render the modal */}
      {modalOpen && (
        <SimpleModal
          open={modalOpen}
          onClose={closeModal}
          data={modalData}
          onSave={handleSaveReporte}
        />
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
          entityName="Estructura"
          onRowAction={handleModal}
        />
      )}
    </div>
  );
};

export default Estructura;
