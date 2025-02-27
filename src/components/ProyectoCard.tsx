import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Button, Chip, Typography, Box, TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import SimpleCard from './SimpleCard';
import Form, { CustomInputs } from './Form';
interface ProyectoData {
  id: number;
  nombre: string;
  direccion: string;
  id_ciudad: number;
  ciudad: {
    nombre: string;
  };
}
interface ConjuntoData {
  id: number;
  nombre: string;
  id_residente_encargado: number;
  id_proyecto: number;
  id_tipo_vivienda: number;
  residente_encargado: {
    nombre: string;
  };
  proyecto: {
    nombre: string;
  };
  tipo_vivienda: {
    nombre: string;
  };
}
interface EstructuraData {
  id: number;
  nombre: string;
  id_conjunto: number;
  id_tipo_estructura: number;
  tipo_estructura: {
    nombre: string;
  };
}interface ActividadesEstructuraData {
  id: number;
  id_actividad: number;
  id_estructura: number;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  id_reporte: number;
  id_estado: number;
  estructura: {
    nombre: string;
  };
  actividad: {
    nombre: string;
  };
  estado: {
    nombre: string;
  };
  reporte: {
    descripcion: string;
    interventor?: {
      nombre: string;
    };
    residente?: {
      nombre: string;
    };
    contratista?: {
      nombre: string;
    };
    resultado?: {
      id?: number;
      nombre: string;
    };
  };
}
interface ReporteData {
  id: number;
  id_interventor: number;
  id_residente: number;
  id_contratista: number;
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
  resultado: {
    id?: number;
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

interface FormData {
  descripcion_reporte: string;
  interventor: string;
  residente: string;
  contratista: string;
  resultado: string;
}
const ProyectoCard: React.FC = () => {
  const [proyectosData, setProyectosData] = useState<ProyectoData[]>([]);
  const [conjuntosData, setConjuntosData] = useState<ConjuntoData[]>([]);
  const [estructurasData, setEstructurasData] = useState<EstructuraData[]>([]);
  const [actividadesData, setActividadesData] = useState<ActividadesEstructuraData[]>([]);
  const [reporteData, setReporteData] = useState<ReporteData[]>([]);
  const [porcentajesCompletados, setPorcentajesCompletados] = useState<number[]>([]);
  // Estados para el formulario de reporte
  const [reporteFormOpen, setReporteFormOpen] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState<ActividadesEstructuraData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    descripcion_reporte: '',
    interventor: '',
    residente: '',
    contratista: '',
    resultado: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // Estados para el diálogo de conjuntos
  const [conjuntosDialogOpen, setConjuntosDialogOpen] = useState(false);
  const [selectedProyecto, setSelectedProyecto] = useState<ProyectoData | null>(null);
  const [conjuntosRelacionados, setConjuntosRelacionados] = useState<ConjuntoData[]>([]);
  // Estados para el diálogo de estructuras
  const [estructurasDialogOpen, setEstructurasDialogOpen] = useState(false);
  const [selectedConjunto, setSelectedConjunto] = useState<ConjuntoData | null>(null);
  const [estructurasRelacionadas, setEstructurasRelacionadas] = useState<EstructuraData[]>([]);
  // Estados para el diálogo de actividades
  const [actividadesDialogOpen, setActividadesDialogOpen] = useState(false);
  const [selectedEstructura, setSelectedEstructura] = useState<EstructuraData | null>(null);
  const [actividadesRelacionadas, setActividadesRelacionadas] = useState<ActividadesEstructuraData[]>([]);

  // Estados para los selects del formulario
  const [interventores, setInterventores] = useState<PersonaOption[]>([]);
  const [residentes, setResidentes] = useState<PersonaOption[]>([]);
  const [contratistas, setContratistas] = useState<PersonaOption[]>([]);
  const [resultados, setResultados] = useState<ResultadoOption[]>([]);
  const fetchProyectos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:4000/proyecto');
      if (!response.ok) {
        throw new Error('Failed to fetch proyecto data');
      }
      const data = await response.json();
      setProyectosData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching proyecto data:', error);
      setError('Failed to fetch proyecto data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  const fetchConjuntos = async () => {
    try {
      const response = await fetch('http://localhost:4000/conjunto');
      if (!response.ok) {
        throw new Error('Failed to fetch conjunto data');
      }
      const data = await response.json();
      setConjuntosData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching conjunto data:', error);
      // No mostramos el error para conjuntos aquí, ya que no es crítico para la carga inicial
    }
  };
  const fetchEstructuras = async () => {
    try {
      const response = await fetch('http://localhost:4000/estructura');
      if (!response.ok) {
        throw new Error('Failed to fetch estructura data');
      }
      const data = await response.json();
      setEstructurasData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching estructura data:', error);
      // No mostramos el error para estructuras aquí, ya que no es crítico para la carga inicial
    }
  };
  const fetchActividades = async () => {
    try {
      const response = await fetch('http://localhost:4000/actividades-estructura');
      if (!response.ok) {
        throw new Error('Failed to fetch actividades data');
      }
      const data = await response.json();
      setActividadesData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching actividades data:', error);
      // No mostramos el error para actividades aquí, ya que no es crítico para la carga inicial
    }
  };
  // Fetch de datos para los selects del formulario
  const fetchFormSelectData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [reportesResponse, personasResponse, resutadosResponse] = await Promise.all([
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
      setReporteData(Array.isArray(reportesData.records) ? reportesData.records : reportesData);
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
    fetchProyectos();
    fetchConjuntos();
    fetchEstructuras();
    fetchActividades();
    fetchFormSelectData();
  }, []);
  // Función para mostrar los conjuntos relacionados con un proyecto
  const handleShowConjuntos = (proyecto: ProyectoData) => {
    const conjuntosRelacionados = conjuntosData.filter(
      conjunto => conjunto.id_proyecto === proyecto.id
    );
    setSelectedProyecto(proyecto);
    setConjuntosRelacionados(conjuntosRelacionados);
    setConjuntosDialogOpen(true);
  };
  // Función para mostrar las estructuras relacionadas con un conjunto
  const handleShowEstructuras = async (conjunto: ConjuntoData) => {
    const estructurasRelacionadas = estructurasData.filter(
      estructura => estructura.id_conjunto === conjunto.id
    );
    setSelectedConjunto(conjunto);
    setEstructurasRelacionadas(estructurasRelacionadas);

    // Obtener los porcentajes de actividades completadas para cada estructura
    const ids = estructurasRelacionadas.map(estructura => estructura.id);
    const porcentajesResponses = await Promise.all(
      ids.map(id => fetch(`http://localhost:4000/estructura/porcentaje/${id}`).then(response => response.json()))
    );

    // Procesar los porcentajesResponses para obtener los porcentajes de actividades completadas
    const porcentajesCompletados = porcentajesResponses.map(
      response => response.porcentaje.porcentaje_actividades_completadas
    );

    setPorcentajesCompletados(porcentajesCompletados);
    setEstructurasDialogOpen(true);
  };  // Función para mostrar las actividades relacionadas con una estructura
  const handleShowActividadesEstructura = (estructura: EstructuraData) => {
    const actividadesRelacionadas = actividadesData.filter(
      actividad => actividad.id_estructura === estructura.id
    );
    setSelectedEstructura(estructura);
    setActividadesRelacionadas(actividadesRelacionadas);
    setActividadesDialogOpen(true);
  };
  // Función para mostrar el formulario de reporte de actividad
  const handleShowReporteActividades = (actividad: ActividadesEstructuraData) => {
    setSelectedActividad(actividad);
    // Inicializar el formulario con datos existentes si los hay
    setFormData({
      descripcion_reporte: actividad.reporte?.descripcion || '',
      interventor: actividad.reporte?.interventor?.nombre || '',
      residente: actividad.reporte?.residente?.nombre || '',
      contratista: actividad.reporte?.contratista?.nombre || '',
      resultado: actividad.reporte?.resultado?.nombre || ''
    });

    setReporteFormOpen(true);
  };

  // Función para actualizar el estado de una actividad a 'Culminado' (id_estado = 3) 
  // si el id_resultado del reporte es igual a 3
  // Función para encontrar el siguiente reporte y actualizarlo
  const encontrarYActualizarSiguienteReporte = async (actividadActual: ActividadesEstructuraData, resultadoId: number) => { };

  // Función para encontrar y actualizar la siguiente estructura
  const encontrarYActualizarSiguienteEstructura = async (estructuraActual: EstructuraData) => { };

  // Función modificada para actualizar el estado de una actividad
  const updateEstadoActividad = async (actividadId: number, reporteResultadoId: number) => { };

  // Función modificada para actualizar el estado de una estructura
  const updateEstadoEstructura = async (estructuraId: number) => { };

  // Función modificada para manejar el envío del formulario
  // Modificar la función handleSubmitForm para llamar al endpoint después de enviar el formulario
  const handleSubmitForm = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);
      // Convertimos los IDs de string a número para la API
      const payloadData = {
        descripcion_reporte: data.descripcion_reporte,
        id_interventor: parseInt(data.interventor),
        id_residente: parseInt(data.residente),
        id_contratista: parseInt(data.contratista),
        id_resultado: parseInt(data.resultado),
        id_actividad: selectedActividad?.id
      };
      let response;
      if (selectedActividad?.id_reporte) {
        // Si ya existe un reporte, actualizarlo (PUT)
        response = await fetch(`http://localhost:4000/reporte/${selectedActividad.id_reporte}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payloadData),
        });
      } else {
        // Si no existe un reporte, crear uno nuevo (POST)
        response = await fetch('http://localhost:4000/reporte', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payloadData),
        });
      }
      if (!response.ok) {
        throw new Error(`Failed to ${selectedActividad?.id_reporte ? 'update' : 'create'} report`);
      }

      // Obtener la respuesta para conseguir el ID del reporte
      const responseData = await response.json();
      const reporteId = selectedActividad?.id_reporte || responseData.id;

      // Llamar al endpoint handleUpdateActividadEstructura después de crear/actualizar el reporte
      const updateResponse = await fetch(`http://localhost:4000/estructura/handleUpdateActividadEstructura/${reporteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!updateResponse.ok) {
        console.warn('No se pudo actualizar la actividad estructura, pero el reporte fue guardado');
      } else {
        const updateResult = await updateResponse.json();
        console.log('Resultado de actualización de actividad estructura:', updateResult);
      }

      // Actualizar los datos de actividades para reflejar el cambio
      await fetchActividades();

      // Verificar si debemos actualizar el estado de la actividad
      if (selectedActividad) {
        await updateEstadoActividad(selectedActividad.id, parseInt(data.resultado));
        // Si se actualizó la actividad, verificar si debemos actualizar la estructura
        if (selectedActividad.id_estructura) {
          await updateEstadoEstructura(selectedActividad.id_estructura);
        }
      }

      // Mostrar mensaje de éxito
      setSuccess(`Reporte ${selectedActividad?.id_reporte ? 'actualizado' : 'creado'} correctamente`);
      // Cerrar el formulario
      setReporteFormOpen(false);
    } catch (error) {
      console.error('Error submitting report:', error);
      setError(`Error al ${selectedActividad?.id_reporte ? 'actualizar' : 'crear'} el reporte. Inténtelo de nuevo más tarde.`);
      throw error; // Re-lanzar el error para que Form.tsx pueda manejarlo
    } finally {
      setLoading(false);
    }
  }; const handleCloseConjuntosDialog = () => {
    setConjuntosDialogOpen(false);
  };
  const handleCloseEstructurasDialog = () => {
    setEstructurasDialogOpen(false);
    // No cerramos el diálogo de conjuntos para permitir volver a la lista de conjuntos
  };
  const handleCloseActividadesDialog = () => {
    setActividadesDialogOpen(false);
    // No cerramos el diálogo de estructuras para permitir volver a la lista de estructuras
  };

  const handleCloseReporteForm = () => {
    setReporteFormOpen(false);
  };
  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No definida';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  // Función para obtener un color basado en el estado
  const getStatusColor = (estadoNombre: string) => {
    switch (estadoNombre.toLowerCase()) {
      case 'completado':
      case 'finalizado':
      case 'terminado':
      case 'culminado':
        return 'success';
      case 'en progreso':
      case 'iniciado':
        return 'primary';
      case 'pendiente':
        return 'warning';
      case 'cancelado':
        return 'error';
      default:
        return 'default';
    }
  };
  // Configuración de customInputs para los campos de formulario tipo select
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
  const fields = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'direccion', label: 'Direccion' },
    { key: 'ciudad', label: 'Ciudad' }
  ];
  // Campos para el formulario de reporte
  const reporteFields = [
    { key: 'descripcion_reporte', header: 'Descripción del reporte' },
    { key: 'interventor', header: 'Interventor' },
    { key: 'residente', header: 'Residente' },
    { key: 'contratista', header: 'Contratista' },
    { key: 'resultado', header: 'Resultado' }
  ];
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <CircularProgress />
      </div>
    );
  }
  return (  
    <div style={{ padding: '1rem' }}>
      <h2>Proyectos</h2>
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
      <Grid container spacing={2}>
        {proyectosData.map((proyecto) => (
          <Grid item xs={12} sm={6} md={4} key={proyecto.id}>
            <div onClick={() => handleShowConjuntos(proyecto)} style={{ cursor: 'pointer' }}>
              <SimpleCard
                fields={fields}
                data={{
                  ...proyecto,
                  ciudad: proyecto.ciudad.nombre,
                }}
                title={proyecto.nombre}
              />
            </div>
          </Grid>
        ))}
      </Grid>
      {/* Diálogo para mostrar los conjuntos relacionados */}
      <Dialog open={conjuntosDialogOpen} onClose={handleCloseConjuntosDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProyecto ? `Conjuntos en ${selectedProyecto.nombre}` : 'Conjuntos'}
        </DialogTitle>
        <DialogContent>
          {conjuntosRelacionados.length > 0 ? (
            <List>
              {conjuntosRelacionados.map((conjunto) => (
                <ListItem
                  key={conjunto.id}
                  onClick={() => handleShowEstructuras(conjunto)}
                  style={{ cursor: 'pointer', border: '1px solid #eee', borderRadius: '4px', margin: '8px 0', backgroundColor: '#f9f9f9' }}
                >
                  <ListItemText
                    primary={conjunto.nombre}
                    secondary={`Encargado: ${conjunto.residente_encargado.nombre} | Tipo: ${conjunto.tipo_vivienda.nombre}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <p>No hay conjuntos asociados a este proyecto.</p>
          )}
        </DialogContent>
      </Dialog>
      {/* Diálogo para mostrar las estructuras relacionadas */}
      <Dialog open={estructurasDialogOpen} onClose={handleCloseEstructurasDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedConjunto ? `Estructuras en ${selectedConjunto.nombre}` : 'Estructuras'}
        </DialogTitle>
        <DialogContent>
          {estructurasRelacionadas.length > 0 ? (
            <List>
              {estructurasRelacionadas.map((estructura, index) => (
                <ListItem
                  key={estructura.id}
                  onClick={() => handleShowActividadesEstructura(estructura)}
                  style={{ cursor: 'pointer', border: '1px solid #eee', borderRadius: '4px', margin: '8px 0', backgroundColor: '#f9f9f9' }}
                >
                  <ListItemText
                    primary={estructura.nombre}
                    secondary={`Porcentaje: ${porcentajesCompletados[index] || 0}% | Tipo: ${estructura.tipo_estructura.nombre}`}
                  />
                </ListItem>
              ))}            </List>
          ) : (
            <p>No hay estructuras asociadas a este conjunto.</p>
          )}
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCloseEstructurasDialog}
            style={{ marginTop: '16px' }}
          >
            Volver a conjuntos
          </Button>
        </DialogContent>
      </Dialog>
      {/* Diálogo para mostrar las actividades relacionadas con la estructura */}
      <Dialog open={actividadesDialogOpen} onClose={handleCloseActividadesDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedEstructura ? `Actividades de ${selectedEstructura.nombre}` : 'Actividades'}
        </DialogTitle>
        <DialogContent>
          {actividadesRelacionadas.length > 0 ? (
            <List>
              {actividadesRelacionadas.map((actividad) => (
                <ListItem
                  key={actividad.id}
                  style={{ border: '1px solid #eee', borderRadius: '4px', margin: '8px 0', backgroundColor: '#f9f9f9', cursor: 'pointer' }}
                  onClick={() => handleShowReporteActividades(actividad)}
                >
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6">{actividad.actividad.nombre}</Typography>
                      <Chip
                        label={actividad.estado.nombre}
                        color={getStatusColor(actividad.estado.nombre)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" gutterBottom>
                      {actividad.descripcion}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption">
                        Estado: {actividad.estado.nombre}
                      </Typography>
                      <Typography variant="caption">
                        Inicio: {formatDate(actividad.fecha_inicio)}
                      </Typography>
                      <Typography variant="caption">
                        Fin: {formatDate(actividad.fecha_fin)}
                      </Typography>
                    </Box>
                    {actividad.reporte && actividad.reporte.descripcion && (
                      <Box sx={{ mt: 1, p: 1, backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                        <Typography variant="caption" component="div">
                          <strong>Reporte:</strong> {actividad.reporte.descripcion}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <p>No hay actividades asociadas a esta estructura.</p>
          )}
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCloseActividadesDialog}
            style={{ marginTop: '16px', marginRight: '8px' }}
          >
            Volver a estructuras
          </Button>
        </DialogContent>
      </Dialog>

      {/* Formulario de reporte de actividad utilizando el componente Form */}
      <Form
        open={reporteFormOpen}
        onClose={handleCloseReporteForm}
        onSubmit={handleSubmitForm}
        fields={reporteFields}
        initialData={formData}
        customInputs={customInputs}
        entityName="Reporte de actividad"
        isEditing={Boolean(selectedActividad?.reporte)}
      />
    </div>
  );
};
export default ProyectoCard;