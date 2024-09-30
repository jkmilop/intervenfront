import React, { useState, useCallback } from 'react';
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  DataGridProps,
  GridRowModel,
  GridRowId,
  GridValidRowModel,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { CircularProgress, Typography, Box, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface TableProps<T extends GridValidRowModel> {
  columns: GridColDef[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  dataGridProps?: Partial<DataGridProps>;
  getRowId?: (row: T) => string | number;
  onRowAdd?: (newRow: GridRowModel) => Promise<void>;
  onRowUpdate?: (updatedRow: GridRowModel) => Promise<void>;
  onRowDelete?: (id: GridRowId) => Promise<void>;
}

const Table = <T extends GridValidRowModel>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  className = '',
  dataGridProps = {},
  getRowId,
  onRowAdd,
  onRowUpdate,
  onRowDelete,
}: TableProps<T>): JSX.Element => {
  const [rows, setRows] = useState<GridRowsProp>(data);

  const rowsMemoized: GridRowsProp = React.useMemo(() => {
    return data.map((row, index) => ({
      id: getRowId ? getRowId(row) : index,
      ...row,
    }));
  }, [data, getRowId]);

  const handleRowAdd = useCallback(async () => {
    if (onRowAdd) {
      const newRow = { id: Date.now() };
      await onRowAdd(newRow);
      setRows((prevRows) => [...prevRows, newRow]);
    }
  }, [onRowAdd]);

  const handleRowUpdate = useCallback(
    async (updatedRow: GridRowModel) => {
      if (onRowUpdate) {
        await onRowUpdate(updatedRow);
        setRows((prevRows) => prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
      }
    },
    [onRowUpdate]
  );

  const handleRowDelete = useCallback(
    async (id: GridRowId) => {
      if (onRowDelete) {
        console.log('Deleting row with id:', id); // Check if this is logged
        await onRowDelete(id);
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      }
    },
    [onRowDelete]
  );

  const enhancedColumns = React.useMemo(
    () => [
      ...columns.map(col => ({ ...col, editable: true })), // Ensure columns are editable
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        filterable: false,
        width: 100,
        renderCell: (params: { id: GridRowId; }) => (
          <IconButton onClick={() => handleRowDelete(params.id)} color="secondary" aria-label="delete">
            <DeleteIcon />
          </IconButton>
        ),
      },
    ],
    [columns, handleRowDelete]
  );

  return (
    <Box className={className} sx={{ height: 500, width: '100%' }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {onRowAdd && (
            <Button
              onClick={handleRowAdd || (() => console.log('No onRowAdd function provided'))}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ mb: 2 }}
            >
              Agregar fila
            </Button>
          )}
          <DataGrid
            rows={rowsMemoized}
            columns={enhancedColumns}
            disableRowSelectionOnClick
            autoHeight
            editMode="row"
            processRowUpdate={async (newRow, oldRow) => {
              await handleRowUpdate(newRow);
              return newRow;
            }}
            onProcessRowUpdateError={(error) => console.error('Error updating row: ', error)}
            {...dataGridProps}
          />
        </>
      )}
    </Box>
  );
};

export default Table;