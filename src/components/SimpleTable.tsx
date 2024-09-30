import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TableSortLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import '../css/SimpleTable.css'; // Import the CSS file

interface Column {
  key: string;
  header: string;
  isCurrency?: boolean; // Optional property to indicate currency columns
}

interface Row {
  id: number | string;
  [key: string]: any;
}

interface CustomInputs {
  [key: string]: (value: any, onChange: (value: any) => void) => React.ReactNode;
}

interface SimpleTableProps {
  columns: Column[];
  data: Row[];
  onAdd: (newRow: Omit<Row, 'id'>) => void;
  onEdit: (editedRow: Row) => void;
  onDelete: (id: number | string) => void;
  customInputs?: CustomInputs;
  entityName: string; // Used for dynamic titles
}

const SimpleTable: React.FC<SimpleTableProps> = ({
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  customInputs,
  entityName,
}) => {
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<Row | null>(null);
  const [formData, setFormData] = useState<Partial<Row>>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [sortedData, setSortedData] = useState<Row[]>(data);

  useEffect(() => {
    if (sortConfig) {
      const sorted = [...data].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        // Handle numeric and string comparison
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === 'asc' 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal);
        }

        // Fallback to 0 if types are different or not sortable
        return 0;
      });
      setSortedData(sorted);
    } else {
      setSortedData(data);
    }
  }, [data, sortConfig]);

  const handleOpen = (row: Row | null = null) => {
    setEditingRow(row);
    
    // Make sure formData is initialized with the actual ID values for etapa and tipoActividad
    setFormData({
      ...row,
      etapa: row ? row.id_etapa : '', // Ensure we use the ID, not the display name
      tipoActividad: row ? row.id_tipo_actividad : '', // Ensure we use the ID, not the display name
    });
    
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    setEditingRow(null);
    setFormData({});
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (editingRow) {
      onEdit({ ...editingRow, ...formData });
    } else {
      onAdd(formData as Omit<Row, 'id'>);
    }
    handleClose();
  };

  const handleSort = (columnKey: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Button
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          style={{ margin: '16px' }} // Add some margin for spacing
        >
          Agregar
        </Button>

        <Table className="simple-table">
          {/* Optional: Add a caption if needed */}
          {/* <caption>Table Caption</caption> */}

          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <TableSortLabel
                    active={sortConfig?.key === column.key}
                    direction={sortConfig?.key === column.key ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort(column.key)}
                  >
                    {column.header}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                  <TableCell
                    key={`${row.id}-${column.key}`}
                    className={column.isCurrency ? 'currency' : ''}
                    data-label={column.header} // For responsive design
                  >
                    {row[column.key]}
                  </TableCell>
                ))}
                <TableCell className="options-cell">
                  <IconButton onClick={() => handleOpen(row)} aria-label={`Editar ${entityName}`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete(row.id)} aria-label={`Eliminar ${entityName}`}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* Optional: Add a footer if needed */}
          {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={columns.length + 1}>Footer Content</TableCell>
            </TableRow>
          </TableFooter> */}
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingRow ? `Editar ${entityName}` : `Agregar ${entityName}`}</DialogTitle>
        <DialogContent>
          {columns.map((column) => (
            <React.Fragment key={column.key}>
              {customInputs && customInputs[column.key] ? (
                customInputs[column.key](
                  formData[column.key] || '',
                  (value) => handleInputChange(column.key, value)
                )
              ) : (
                <TextField
                  name={column.key}
                  label={column.header}
                  value={formData[column.key] || ''}
                  onChange={(e) => handleInputChange(column.key, e.target.value)}
                  fullWidth
                  margin="normal"
                />
              )}
            </React.Fragment>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SimpleTable;
export type { Column, Row, SimpleTableProps, CustomInputs };
