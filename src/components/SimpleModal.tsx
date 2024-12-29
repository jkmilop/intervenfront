import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface DataProps {
  id_reporte: string;
  actividad: string;
  fecha_inicio: string;
  [key: string]: any;
}

interface SimpleModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (updatedData: DataProps, reportId: string) => void;
  data?: DataProps | null;
}

const SimpleModal: React.FC<SimpleModalProps> = ({ open, onClose, onSave, data }) => {
  const handleSave = () => {
    if (data && data.id_reporte) {
      const updatedData = {
        ...data,
        actividad: `${data.actividad} (Actualizado)`, // Ejemplo de actualización
      };
      onSave(updatedData, data.id_reporte);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalles de Actividad en Proceso</DialogTitle>
      <DialogContent dividers>
        {data ? (
          <div style={{ margin: '1rem 0' }}>
            <p><strong>Nombre:</strong> {data.actividad || 'Sin nombre'}</p>
            <p><strong>Fecha de Inicio:</strong> {data.fecha_inicio || 'Sin fecha'}</p>
            {Object.entries(data).map(([key, value]) =>
              key !== 'actividad' && key !== 'fecha_inicio' && key !== 'id_reporte' ? (
                <p key={key}><strong>{key}:</strong> {value}</p>
              ) : null
            )}
          </div>
        ) : (
          <p>Cargando datos...</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cerrar</Button>
        <Button onClick={handleSave} color="secondary" disabled={!data || !data.id_reporte}>
          Evaluar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SimpleModal;
