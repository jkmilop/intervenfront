import React from 'react';
import Table from './Table';
import { GridColDef } from '@mui/x-data-grid';

// Define the interface for the actividad data
interface Actividad {
  id: number;
  nombre: string;
  ubicacion: string;
  empresa: string;
}

const TrackerActividades: React.FC = () => {
  // Sample data for demonstration purposes
  const actividadesData: Actividad[] = [
    { id: 1, nombre: 'Actividad 1', ubicacion: 'ubicacion 1', empresa: 'Completed' },
    { id: 2, nombre: 'Actividad 2', ubicacion: 'ubicacion 2', empresa: 'Pending' },
  ];

  // Define the columns configuration for the DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'nombre', headerName: 'nombre', width: 150 },
    { field: 'empresa', headerName: 'empresa', width: 150 },
    { field: 'ubicacion', headerName: 'ubicacion', width: 200 },
  ];

  return (
    <Table<Actividad>
      columns={columns}
      data={actividadesData}
      emptyMessage="No actividades available"
      className="global-actividades-table"
    />
  );
};

export default TrackerActividades;
