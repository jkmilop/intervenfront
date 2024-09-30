import React, { useState, useEffect } from 'react';
import SimpleTable, { Column, Row } from './SimpleTable';

interface ActividadData {
  id: number;
  nombre: string;
  id_etapa: number;
  id_tipo_actividad: number;
  etapa: {
    nombre: string;
  };
  tipo_actividad: {
    actividad: string;
  };
}

const Actividad: React.FC = () => {
  const [activitiesData, setActivitiesData] = useState<ActividadData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/actividad');
        const data = await response.json();
        setActivitiesData(data);
      } catch (error) {
        console.error('Error fetching activities data:', error);
      }
    };

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
      etapa: actividad.etapa.nombre,
      tipoActividad: actividad.tipo_actividad.actividad,
    }));
  };

  // Dummy functions for CRUD operations (replace with actual implementations if needed)
  const handleAdd = (newRow: Omit<Row, 'id'>) => {
    console.log('Add operation:', newRow);
  };

  const handleEdit = (editedRow: Row) => {
    console.log('Edit operation:', editedRow);
  };

  const handleDelete = (id: number | string) => {
    console.log('Delete operation:', id);
  };

  if (activitiesData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Actividades</h2>
      <SimpleTable
        columns={columns}
        data={generateTableData(activitiesData)}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Actividad;