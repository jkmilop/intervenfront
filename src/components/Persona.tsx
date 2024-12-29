
import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row, CustomInputs } from './SimpleTable';
import { CircularProgress, Snackbar, Alert } from '@mui/material';

interface PersonaData {
  id: number;
  nombre: string;
  cedula: number;
  id_empresa: number;
  telefono: number;
  id_rol: number;
  empresa: {
    nombre: string;
  };
  rol: {
    nombre: string;
  };
}

const Persona: React.FC = () => {
  const [personasData, setPersonasData] = useState<PersonaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/persona');
      if (!response.ok) {
        throw new Error('Failed to fetch persona data');
      }
      const data = await response.json();
      setPersonasData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching persona data:', error);
      setError('Failed to fetch persona data. Please try again later.');
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
    { key: 'cedula', header: 'Cedula' },
    { key: 'id_empresa', header: 'Id_empresa' },
    { key: 'telefono', header: 'Telefono' },
    { key: 'id_rol', header: 'Id_rol' },
    { key: 'empresa', header: 'Empresa' },
    { key: 'rol', header: 'Rol' }
  ];

  const generateTableData = (data: PersonaData[] = []): Row[] => {
    return data.map((persona) => ({
      id: persona.id, nombre: persona.nombre, cedula: persona.cedula, id_empresa: persona.id_empresa, telefono: persona.telefono, id_rol: persona.id_rol, empresa: persona.empresa.nombre, rol: persona.rol.nombre
    }));
  };

  const handleAdd = async (newRow: Omit<Row, 'id'>) => {
    try {
      const response = await fetch('http://localhost:4000/persona', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add new persona: ${errorData.message || 'Internal server error'}`);
      }

      const addedPersona: PersonaData = await response.json();
      setSuccess('Persona added successfully.');
      setPersonasData([...personasData, addedPersona]);
    } catch (error) {
      console.error('Error adding new persona:', error);
      setError(`Failed to add new persona: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (editedRow: Row) => {
    try {
      const response = await fetch(`http://localhost:4000/persona/${editedRow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedRow),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to edit persona: ${errorData.message || 'Internal server error'}`);
      }

      const updatedPersona: PersonaData = await response.json();
      setSuccess('Persona edited successfully.');
      setPersonasData(personasData.map(persona => 
        persona.id === updatedPersona.id ? updatedPersona : persona
      ));
    } catch (error) {
      console.error('Error editing persona:', error);
      setError(`Failed to edit persona: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      const response = await fetch(`http://localhost:4000/persona/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete persona: ${errorData.message || 'Internal server error'}`);
      }

      setSuccess('Persona deleted successfully.');
      setPersonasData(personasData.filter(persona => persona.id !== id));
    } catch (error) {
      console.error('Error deleting persona:', error);
      setError(`Failed to delete persona: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <h2>Personas</h2>
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
      {Boolean(personasData.length) ? (
        <SimpleTable
          columns={columns}
          data={generateTableData(personasData)}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customInputs={customInputs}
          entityName="Persona"
        />
      ) : (
        <div>No personas found.</div>
      )}
    </div>
  );
};

export default Persona;
