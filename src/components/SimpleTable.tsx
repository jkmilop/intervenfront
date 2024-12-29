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
  TableSortLabel,
  Typography,
  Tooltip,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import QuizIcon from '@mui/icons-material/Quiz';
import DetailsIcon from '@mui/icons-material/Details';
interface Column {
  key: string;
  header: string;
  isCurrency?: boolean;
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
  entityName: string;
  onRowAction?: (id: number | string) => void;
}

const SimpleTable: React.FC<SimpleTableProps> = ({
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  customInputs,
  entityName,
  onRowAction,
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

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        return 0;
      });
      setSortedData(sorted);
    } else {
      setSortedData(data);
    }
  }, [data, sortConfig]);

  const handleOpen = (row: Row | null = null) => {
    setEditingRow(row);
    setFormData({ ...row });
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        {entityName} 
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ m: 2 }}
          variant="contained"
        >
          Agregar {entityName}
        </Button>
        <Table>
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
                  <TableCell key={`${row.id}-${column.key}`} sx={{ whiteSpace: 'nowrap' }}>
                    {row[column.key]}
                  </TableCell>
                ))}
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => handleOpen(row)} aria-label={`Editar ${entityName}`}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton onClick={() => onDelete(row.id)} aria-label={`Eliminar ${entityName}`}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Ver Actividad Actual">
                    <IconButton
                      onClick={() => onRowAction?.(row.id)} // Safely invoke onRowAction with two arguments
                    >
                      <DetailsIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Evaluar Actividad">
                    <IconButton
                      onClick={() => onRowAction?.(row.id)} // Safely invoke onRowAction with two arguments
                    >
                      <QuizIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer >

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
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
};

export default SimpleTable;
export type { Column, Row, SimpleTableProps, CustomInputs };
