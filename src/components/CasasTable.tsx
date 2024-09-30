import React from 'react';
import Table from './Table';
import { GridColDef } from '@mui/x-data-grid';

// Define the interface for casa data
interface Casa {
  id: number;
  numero: string;
  residente: string;
  conjunto: string;
}

const CasasTable: React.FC = () => {
  // Sample data for demonstration purposes
  const casasData: Casa[] = [
    { id: 1, numero: '123 Elm St', residente: 'John Doe', conjunto: 'Green Acres' },
    { id: 2, numero: '456 Oak St', residente: 'Jane Smith', conjunto: 'Sunnyvale' },
  ];

  // Define the columns configuration for the DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'numero', headerName: 'numero', width: 200 },
    { field: 'residente', headerName: 'residente', width: 150 },
    { field: 'conjunto', headerName: 'conjunto', width: 150 },
  ];

  return (
    <Table<Casa>
      columns={columns}
      data={casasData}
      emptyMessage="No casas available"
      className="casas-table"
    />
  );
};

export default CasasTable;
