import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

interface FormField {
  key: string;
  header: string;
  isCurrency?: boolean;
}

interface FormData {
  id?: number | string;
  [key: string]: any;
}

interface CustomInputs {
  [key: string]: (value: any, onChange: (value: any) => void) => React.ReactNode;
}

interface FormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  fields: FormField[];
  initialData?: FormData;
  customInputs?: CustomInputs;
  entityName: string;
  isEditing: boolean;
}

const Form: React.FC<FormProps> = ({
  open,
  onClose,
  onSubmit,
  fields,
  initialData = {},
  customInputs,
  entityName,
  isEditing
}) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Update form data when initialData changes
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      await onSubmit(formData);
      setSuccess(`${entityName} ${isEditing ? 'editado' : 'agregado'} exitosamente.`);
      onClose();
    } catch (error) {
      console.error(`Error ${isEditing ? 'editando' : 'agregando'} ${entityName}:`, error);
      setError(`Error: ${error instanceof Error ? error.message : 'Ocurrió un error inesperado'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? `Editar ${entityName}` : `Agregar ${entityName}`}</DialogTitle>
        <DialogContent>
          {fields.map((field) => (
            <React.Fragment key={field.key}>
              {customInputs && customInputs[field.key] ? (
                customInputs[field.key](
                  formData[field.key] || '',
                  (value) => handleInputChange(field.key, value)
                )
              ) : (
                <TextField
                  name={field.key}
                  label={field.header}
                  value={formData[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  fullWidth
                  margin="normal"
                />
              )}
            </React.Fragment>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default Form;
export type { FormField, FormData, FormProps, CustomInputs };