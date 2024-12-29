
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { Select, MenuItem, CircularProgress, Snackbar, Alert, FormControl, InputLabel } from '@mui/material';

interface ReporteData {
  id: number;
  id_interventor: number;
  id_residente: number;
  id_contratista: number;
  id_actividades_estructura: number;
  descripcion_reporte: string;
  interventor: {
    nombre: string;
  };
  residente: {
    nombre: string;
  };
  contratista: {
    nombre: string;
  };
}
interface PersonaOption {
  id: number;
  nombre: string;
}
interface ResultadoOption {
  id: number;
  nombre: string;
}

const Reporte: React.FC = () => {
  const [reportesData, setReportesData] = useState<ReporteData[]>([]);
  const [interventores, setInterventores] = useState<PersonaOption[]>([]);
  const [residentes, setResidentes] = useState<PersonaOption[]>([]);

  const [contratistas, setContratistas] = useState<PersonaOption[]>([]);

  const [resultados, setResultados] = useState<ResultadoOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [reportesResponse, personasResponse,resutadosResponse] = await Promise.all([
        fetch('http://localhost:4000/reporte'),
        fetch('http://localhost:4000/persona'),
        fetch('http://localhost:4000/resultado'),

      ]);

      if (!reportesResponse.ok || !personasResponse.ok || !resutadosResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [reportesData, personasData, resultadosData] = await Promise.all([
        reportesResponse.json(),
        personasResponse.json(),
        resutadosResponse.json(),


      ]);

      // Adjust based on API response structure
      setReportesData(Array.isArray(reportesData.records) ? reportesData.records : reportesData);
      setResidentes(Array.isArray(personasData.records) ? personasData.records : personasData);
      setContratistas(Array.isArray(personasData.records) ? personasData.records : personasData);
      setInterventores(Array.isArray(personasData.records) ? personasData.records : personasData);

      setResultados(Array.isArray(resultadosData.records) ? resultadosData.records : resultadosData);

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
    { key: 'id', header: 'Id' },
    { key: 'id_actividades_estructura', header: 'Id_actividades_estructura' },
    { key: 'descripcion_reporte', header: 'Descripcion_reporte' },
    { key: 'interventor', header: 'Interventor' },
    { key: 'residente', header: 'Residente' },
    { key: 'contratista', header: 'Contratista' }
  ];

  const generateTableData = (data: ReporteData[] = []): Row[] => {
    return data.map((reporte) => ({
      id: reporte.id, id_interventor: reporte.id_interventor, id_residente: reporte.id_residente, id_contratista: reporte.id_contratista, id_actividades_estructura: reporte.id_actividades_estructura, descripcion_reporte: reporte.descripcion_reporte, interventor: reporte.interventor?.nombre || 'N/A', residente: reporte.residente?.nombre || 'N/A', contratista: reporte.contratista?.nombre || 'N/A'
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      // First POST request to add new 'reporte'
      const response = await fetch('http://localhost:4000/reporte', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: newRow.nombre,
          id_residente: Number(newRow.residente), // Convert to number
          id_contratista: Number(newRow.contratista), 
          id_interventor: Number(newRow.interventor), // Convert to number

        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new reporte: ${errorData.message || 'Internal server error'}`);
      }
      const addedReporte: ReporteData = await response.json();
      setSuccess('Reporte added successfully.');
      setReportesData([...reportesData, addedReporte]);
    } catch (error) {
      console.error('Error adding new reporte:', error);
      setError(`Failed to add new reporte: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const reporteId = Number(editedRow.id);
      if (isNaN(reporteId)) {
        throw new Error('Invalid ID for editing.');
      }

      const response = await fetch(`http://localhost:4000/reporte/${reporteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: editedRow.nombre,
          id_residente: Number(editedRow.residente), // Convert to number
          id_contratista: Number(editedRow.contratista), 
          id_interventor: Number(editedRow.interventor), // Convert to number
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit reporte: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Reporte edited successfully.');
      fetchData(); // Refetch all data to ensure consistency
    } catch (error) {
      console.error('Error editing reporte:', error);
      setError(`Failed to edit reporte: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const response = await fetch(`http://localhost:4000/reporte/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete reporte: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Reporte deleted successfully.');
      setReportesData(reportesData.filter(reporte => reporte.id !== id));
    } catch (error) {
      console.error('Error deleting reporte:', error);
      setError(`Failed to delete reporte: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const customInputs: CustomInputs = {
    interventor: (value: string, onChange: (value: string) => void) => (
      <FormControl fullWidth>
        <InputLabel id="interventor-label">Interventor</InputLabel>
        <Select
          labelId="interventor-label"
          value={value} // Use the ID value
          label="Interventor"
          onChange={(e) => onChange(e.target.value as string)}
        >
          {interventores.map(interventor => (
            <MenuItem key={interventor.id} value={interventor.id.toString()}>{interventor.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>
    ),
    residente: (value: string, onChange: (value: string) => void) => (
      <FormControl fullWidth>
        <InputLabel id="residente-label">residente</InputLabel>
        <Select
          labelId="residente-label"
          value={value} // Use the ID value
          label="Residente"
          onChange={(e) => onChange(e.target.value as string)}
        >
          {residentes.map(residente => (
            <MenuItem key={residente.id} value={residente.id.toString()}>{residente.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>
    ),

    contratista: (value: string, onChange: (value: string) => void) => (
      <FormControl fullWidth>
        <InputLabel id="tipo-estructura-label">Contratista</InputLabel>
        <Select
          labelId="tipo-estructura-label"
          value={value} // Use the ID value
          label="Contratista"
          onChange={(e) => onChange(e.target.value as string)}
        >
          {contratistas.map(tipo => (
            <MenuItem key={tipo.id} value={tipo.id.toString()}>{tipo.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>
    ),
    resultado: (value: string, onChange: (value: string) => void) => (
      <FormControl fullWidth>
        <InputLabel id="resultado-label">Resultado</InputLabel>
        <Select
          labelId="resultado-label"
          value={value} // Use the ID value
          label="Resultado"
          onChange={(e) => onChange(e.target.value as string)}
        >
          {resultados.map(resultado => (
            <MenuItem key={resultado.id} value={resultado.id.toString()}>{resultado.nombre}</MenuItem>
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
      <h2>Reportes</h2>
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
      {Boolean(reportesData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(reportesData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="Reporte"
        />
      ) : (
        <div>No reportes found.</div>
      )}
    </div>
  );
};

export default Reporte;
