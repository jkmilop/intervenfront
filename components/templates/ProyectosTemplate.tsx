"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Box, TextField, Button, CircularProgress, List, ListItem, ListItemText, Typography, Chip, CircularProgressProps,
  // Nueva importación para el selector
  Select, MenuItem, FormControl, InputLabel
} from "@mui/material"
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material"
import DataTable from "../ui/organisms/DataTable"
import DialogContainer from "../ui/molecules/DialogContainer"
import ReporteForm from "../ui/molecules/ReporteForm"
import type { Column } from "../ui/organisms/DataTable"
import type { TableActionProps } from "../ui/atoms/TableAction"
import type {
  ProyectoData,
  FormData,
  ConjuntoData,
  EstructuraData,
  ActividadEstructuraData,
  PersonaOption,
  ResultadoOption,
  ReporteFormData,
} from "@/lib/api-service"
import { proyectosService } from "@/lib/api-service"

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: 'text.secondary' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

interface ProyectosTemplateProps {
  /**
   * Función para obtener los proyectos
   */
  fetchProyectos: () => Promise<ProyectoData[]>
  /**
   * Función para agregar un proyecto
   */
  addProyecto: (data: Omit<FormData, "id">) => Promise<ProyectoData>
  /**
   * Función para actualizar un proyecto
   */
  updateProyecto: (data: FormData) => Promise<ProyectoData>
  /**
   * Función para eliminar un proyecto
   */
  deleteProyecto: (id: number) => Promise<boolean>
}

/**
 * Template para la gestión de proyectos con integración de ProyectoCard
 */
const ProyectosTemplate: React.FC<ProyectosTemplateProps> = ({
  fetchProyectos,
  addProyecto,
  updateProyecto,
  deleteProyecto,
}) => {
  // Estados para proyectos
  const [proyectos, setProyectos] = useState<ProyectoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({ nombre: "", direccion: "", id_ciudad: 0 })
  const [editingId, setEditingId] = useState<number | null>(null)

  // Estado para ciudades (movido dentro del componente)
  const [cities, setCities] = useState<{ id: number; nombre: string }[]>([])

  // Estados para conjuntos
  const [conjuntosDialogOpen, setConjuntosDialogOpen] = useState(false)
  const [selectedProyecto, setSelectedProyecto] = useState<ProyectoData | null>(null)
  const [conjuntosData, setConjuntosData] = useState<ConjuntoData[]>([])

  // Estados para estructuras
  const [estructurasDialogOpen, setEstructurasDialogOpen] = useState(false)
  const [selectedConjunto, setSelectedConjunto] = useState<ConjuntoData | null>(null)
  const [estructurasRelacionadas, setEstructurasRelacionadas] = useState<EstructuraData[]>([])
  const [estructurasData, setEstructurasData] = useState<EstructuraData[]>([])
  const [porcentajesCompletados, setPorcentajesCompletados] = useState<number[]>([])
  const [porcentajesCompletadosP, setPorcentajesCompletadosP] = useState<number[]>([])

  const [porcentajesCompletadosC, setPorcentajesCompletadosC] = useState<number[]>([])


  // Estados para actividades
  const [actividadesDialogOpen, setActividadesDialogOpen] = useState(false)
  const [selectedEstructura, setSelectedEstructura] = useState<EstructuraData | null>(null)
  const [actividadesData, setActividadesData] = useState<ActividadEstructuraData[]>([])

  // Estados para reportes
  const [reporteFormOpen, setReporteFormOpen] = useState(false)
  const [selectedActividad, setSelectedActividad] = useState<ActividadEstructuraData | null>(null)
  const [reporteFormData, setReporteFormData] = useState<ReporteFormData>({
    descripcion_reporte: "",
    interventor: "",
    residente: "",
    contratista: "",
    resultado: "",
  })

  // Estados para los selects del formulario
  const [interventores, setInterventores] = useState<PersonaOption[]>([])
  const [residentes, setResidentes] = useState<PersonaOption[]>([])
  const [contratistas, setContratistas] = useState<PersonaOption[]>([])
  const [resultados, setResultados] = useState<ResultadoOption[]>([])

  // Definición de columnas
  const columns: Column<ProyectoData>[] = [
    {
      key: "nombre",
      header: "Nombre",
      sortable: true,
      isBold: true,
    },
    {
      key: "direccion",
      header: "Dirección",
      sortable: true,
    },
    {
      key: "ciudad",
      header: "Ciudad",
      sortable: true,
      renderCell: (row) => row.ciudad?.nombre || "",
    },
    {
      key: "estado",
      header: "Estado",
      sortable: true,
      isChip: true,
      chipColorMapping: {
        Activo: "success",
        Finalizado: "info",
        "En construcción": "warning",
        Planificación: "secondary",
        Cancelado: "error",
      },
      renderCell: (row) => row.estado?.nombre || "",
    },
    // Nueva columna para visualizar el progreso del proyecto
    {
      key: "progreso",
      header: "Progreso",
      renderCell: (row) => <CircularProgressWithLabel value={(row as any).progreso || 0} />
    },
  ]

  // Cargar datos iniciales
  const loadProyectos = async () => {
    
    try {
      
      setLoading(true)
      setError(null)
      const data = await fetchProyectos()
      setProyectos(data)
    } catch (err) {
      console.error("Error al cargar proyectos:", err)
      setError("Error al cargar los proyectos: verifique su conexión o contacte al soporte.")
    } finally {
      setLoading(false)
    }
  }

  // Función para cargar las ciudades desde la URL indicada
  const loadCiudades = async () => {
    try {
      const response = await fetch("http://localhost:4000/ciudad/1")
      const cityData = await response.json()
      // Si no es un arreglo, se envuelve en uno
      setCities(Array.isArray(cityData) ? cityData : [cityData])
    } catch (err) {
      console.error("Error al cargar ciudades:", err)
    }
  }

  // Cargar datos para los selects del formulario de reporte
  const loadFormSelectData = async () => {
    try {
      const [personasData, resultadosData] = await Promise.all([
        proyectosService.fetchPersonas(),
        proyectosService.fetchResultados(),
      ])

      // Filtrar las personas según su id_rol:
      setContratistas(personasData.filter((persona: PersonaOption) => persona.id_rol === 1));
      setInterventores(personasData.filter((persona: PersonaOption) => persona.id_rol === 2));
      setResidentes(personasData.filter((persona: PersonaOption) => persona.id_rol === 3));
      setResultados(resultadosData);
    } catch (err) {
      console.error("Error al cargar datos para formularios:", err)
    }
  }

  useEffect(() => {
    loadProyectos()
    loadFormSelectData()
    loadCiudades()
  }, [])

  // Manejadores para proyectos
  const handleOpenDialog = (proyecto?: ProyectoData) => {
    if (proyecto) {
      setFormData({
        id: proyecto.id,
        nombre: proyecto.nombre,
        direccion: proyecto.direccion,
        id_ciudad: proyecto.id_ciudad,
      })
      setEditingId(proyecto.id)
    } else {
      setFormData({ nombre: "", direccion: "", id_ciudad: 0 })
      setEditingId(null)
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setFormData({ nombre: "", direccion: "", id_ciudad: 0 })
    setEditingId(null)
  }

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateProyecto({ ...formData, id: editingId })
        setSuccess("El proyecto se actualizó exitosamente.")
      } else {
        await addProyecto(formData)
        setSuccess("El proyecto se agregó exitosamente.")
      }
      handleCloseDialog()
      loadProyectos()
    } catch (err) {
      console.error("Error al guardar proyecto:", err)
      setError(`Error al guardar el proyecto: ${err instanceof Error ? err.message : "Error desconocido. Por favor contacte al soporte."}`)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteProyecto(id)
      setSuccess("El proyecto se eliminó exitosamente.")
      loadProyectos()
    } catch (err) {
      console.error("Error al eliminar proyecto:", err)
      setError(`Error al eliminar el proyecto: ${err instanceof Error ? err.message : "Error desconocido. Por favor contacte al soporte."}`)
    }
  }

  // Manejadores para conjuntos
  const handleShowConjuntos = async (proyecto: ProyectoData) => {
    try {
      setLoading(true)
      setSelectedProyecto(proyecto)
  
      // 1. Obtener todos los conjuntos asociados al proyecto
      const conjuntos = await proyectosService.fetchConjuntosByProyecto()
      const conjuntosRelacionados = conjuntos.filter(
        (conjunto: { id_proyecto: number }) => conjunto.id_proyecto === proyecto.id
      )
  
      setConjuntosData(conjuntosRelacionados)
      setConjuntosDialogOpen(true)
  
      // 2. Obtener el porcentaje de avance de cada conjunto
      const porcentajesC = await Promise.all(
        conjuntosRelacionados.map(async (conjunto: ConjuntoData) => {
          try {
            const porcentaje = await proyectosService.getEstructuraPorcentajeC(conjunto.id)
            return porcentaje ?? 0 // Ya es un número
          } catch (error) {
            console.error(`❌ Error al obtener porcentaje del conjunto ID ${conjunto.id}:`, error)
            return 0
          }
        })
      )
      setPorcentajesCompletadosC(porcentajesC)
        
      setPorcentajesCompletadosC(porcentajesC)
  
    } catch (err) {
      console.error("❌ Error al cargar conjuntos:", err)
      setError("Error al cargar los conjuntos del proyecto: por favor actualice la página o contacte al soporte.")
    } finally {
      setLoading(false)
    }
  }
  
  const handleCloseConjuntosDialog = () => {
    setConjuntosDialogOpen(false)
    setSelectedProyecto(null)
  }

  // Manejadores para estructuras
  const handleShowEstructuras = async (conjunto: ConjuntoData) => {
    try {
      setLoading(true)
      setSelectedConjunto(conjunto)

      const estructuras = await proyectosService.fetchEstructurasByConjunto()
      const estructurasRelacionados = estructuras.filter(
        (estructura: { id_conjunto: number }) => estructura.id_conjunto === conjunto.id
      )

      setEstructurasData(estructurasRelacionados)

      // Obtener porcentajes de avance
      const porcentajes = await Promise.all(
        estructurasRelacionados.map((estructura: EstructuraData) => proyectosService.getEstructuraPorcentaje(estructura.id))
      )

      setPorcentajesCompletados(porcentajes)
      setEstructurasDialogOpen(true)
    } catch (err) {
      console.error("Error al cargar estructuras:", err)
      setError("Error al cargar las estructuras del conjunto: por favor actualice la página o contacte al soporte.")
    } finally {
      setLoading(false)
    }
  }

  const handleCloseEstructurasDialog = () => {
    setEstructurasDialogOpen(false)
  }

  // Manejadores para actividades
  const handleShowActividades = async (estructura: EstructuraData) => {
    try {
      setLoading(true)
      setSelectedEstructura(estructura)
      const actividades = await proyectosService.fetchActividadesByEstructura()
      const actividadesRelacionadas = actividades.filter(
        (actividad: { id_estructura: number; }) => actividad.id_estructura === estructura.id
      )
      setActividadesData(actividadesRelacionadas)
      setActividadesDialogOpen(true)
    } catch (err) {
      console.error("Error al cargar actividades:", err)
      setError("Error al cargar las actividades de la estructura: por favor actualice la página o contacte al soporte.")
    } finally {
      setLoading(false)
    }
  }

  const handleCloseActividadesDialog = () => {
    setActividadesDialogOpen(false)
  }

  // Manejadores para reportes
  const handleShowReporte = async (actividad: ActividadEstructuraData) => {
    try {
      setLoading(true)
      setSelectedActividad(actividad)

      // Inicializar el formulario con datos existentes si los hay
      if (actividad.id_reporte && actividad.reporte) {
        setReporteFormData({
          descripcion_reporte: actividad.reporte.descripcion || "",
          interventor: actividad.reporte.interventor?.nombre
            ? interventores.find((i) => i.nombre === actividad.reporte.interventor?.nombre)?.id.toString() || ""
            : "",
          residente: actividad.reporte.residente?.nombre
            ? residentes.find((r) => r.nombre === actividad.reporte.residente?.nombre)?.id.toString() || ""
            : "",
          contratista: actividad.reporte.contratista?.nombre
            ? contratistas.find((c) => c.nombre === actividad.reporte.contratista?.nombre)?.id.toString() || ""
            : "",
          resultado: actividad.reporte.resultado?.id ? actividad.reporte.resultado.id.toString() : "",
        })
      } else {
        setReporteFormData({
          descripcion_reporte: "",
          interventor: "",
          residente: "",
          contratista: "",
          resultado: "",
        })
      }

      setReporteFormOpen(true)
    } catch (err) {
      console.error("Error al preparar formulario de reporte:", err)
      setError("Error al preparar el formulario de reporte: por favor intente nuevamente o contacte al soporte.")
    } finally {
      setLoading(false)
    }
  }

  const handleCloseReporteForm = () => {
    setReporteFormOpen(false)
    setSelectedActividad(null)
  }

  const handleSubmitReporte = async (data: ReporteFormData) => {
    try {
      if (!selectedActividad) {
        throw new Error("No se ha seleccionado una actividad")
      }

      await proyectosService.saveReporte(selectedActividad.id, data, selectedActividad.id_reporte)

      setSuccess("El reporte se guardó exitosamente.")

      // Actualizar datos de actividades
      if (selectedEstructura) {
        const actividades = await proyectosService.fetchActividadesByEstructura()
        const actividadesRelacionadas = actividades.filter(
          (actividad: { id_estructura: number; }) => actividad.id_estructura === selectedEstructura.id
        )
        setActividadesData(actividadesRelacionadas)
      }

      // Actualizar estructuras filtrando por el conjunto seleccionado
      if (selectedEstructura && selectedConjunto) {
        const estructuras = await proyectosService.fetchEstructurasByConjunto()
        const estructurasRelacionadas = estructuras.filter(
          (estructura: { id_conjunto: number; }) => estructura.id_conjunto === selectedConjunto.id
        )
        setEstructurasData(estructurasRelacionadas)

        const porcentajes = await Promise.all(
          estructurasRelacionadas.map((estructura: EstructuraData) => proyectosService.getEstructuraPorcentaje(estructura.id))
        )
        if (porcentajes[0] === 100) {
          await proyectosService.updateEstructuraEstado(selectedEstructura.id)
        }
        setPorcentajesCompletados(porcentajes)
      }
      setReporteFormOpen(false)
    } catch (err) {
      console.error("Error al guardar reporte:", err)
      throw err
    }
  }

  // Generar acciones para cada fila
  const getRowActions = (row: ProyectoData): TableActionProps[] => {
    return [
      {
        tooltip: "Editar",
        icon: <EditIcon />,
        onClick: () => handleOpenDialog(row),
        color: "primary",
        ariaLabel: `Editar proyecto ${row.nombre}`,
      },
      {
        tooltip: "Eliminar",
        icon: <DeleteIcon />,
        onClick: () => handleDelete(row.id),
        color: "error",
        ariaLabel: `Eliminar proyecto ${row.nombre}`,
      },
    ]
  }

  // Renderizar formulario de proyecto
  const renderForm = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, py: 1 }}>
      <TextField
        label="Nombre"
        value={formData.nombre}
        onChange={(e) => handleInputChange("nombre", e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Dirección"
        value={formData.direccion}
        onChange={(e) => handleInputChange("direccion", e.target.value)}
        fullWidth
        required
      />
      {/* Reemplazo del campo de ID Ciudad por un Select */}
      <FormControl fullWidth required>
        <InputLabel id="ciudad-label">Ciudad</InputLabel>
        <Select
          labelId="ciudad-label"
          id="ciudad-select"
          value={formData.id_ciudad}
          label="Ciudad"
          onChange={(e) => handleInputChange("id_ciudad", Number(e.target.value))}
        >
          {cities.map((city) => (
            <MenuItem key={city.id} value={city.id}>
              {city.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>    </Box>
  )

  const formatDate = (dateString: string) => {
    if (!dateString) return "No definida"
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const getStatusColor = (
    estadoNombre: string,
  ): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (estadoNombre.toLowerCase()) {
      case "completado":
      case "finalizado":
      case "terminado":
      case "culminado":
        return "success"
      case "en progreso":
      case "iniciado":
        return "primary"
      case "pendiente":
        return "warning"
      case "cancelado":
        return "error"
      default:
        return "default"
    }
  }

  if (loading && proyectos.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {error && (
        <div
          style={{
            position: "fixed",
            top: "16px",
            right: "16px",
            backgroundColor: "#f44336",
            color: "white",
            padding: "12px 16px",
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            zIndex: 1400,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minWidth: "300px",
          }}
        >
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              marginLeft: "16px",
              fontSize: "16px",
            }}
          >
            ×
          </button>
        </div>
      )}
      {success && (
        <div
          style={{
            position: "fixed",
            top: "16px",
            right: "16px",
            backgroundColor: "#4caf50",
            color: "white",
            padding: "12px 16px",
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            zIndex: 1400,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minWidth: "300px",
          }}
        >
          <span>{success}</span>
          <button
            onClick={() => setSuccess(null)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              marginLeft: "16px",
              fontSize: "16px",
            }}
          >
            ×
          </button>
        </div>
      )}

      <DataTable
        title="Proyectos"
        subtitle="Gestión de proyectos"
        columns={columns}
        data={proyectos}
        idField="id"
        selectable
        getRowActions={getRowActions}
        actionButtonText="Nuevo Proyecto"
        actionButtonIcon={<AddIcon />}
        onActionButtonClick={() => handleOpenDialog()}
        searchable
        searchPlaceholder="Buscar proyectos..."
        paginated
        pageSize={10}
        persistState
        urlParamPrefix="proyectos"
        loading={loading}
        emptyMessage="No hay proyectos disponibles"
        onRowClick={(row) => handleShowConjuntos(row as ProyectoData)}
      />

      <DialogContainer
        open={dialogOpen}
        onClose={handleCloseDialog}
        title={editingId ? "Editar Proyecto" : "Nuevo Proyecto"}
        actions={
          <>
            <Button onClick={handleCloseDialog} variant="outlined">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Guardar
            </Button>
          </>
        }
      >
        {renderForm()}
      </DialogContainer>

      <DialogContainer
        open={conjuntosDialogOpen}
        onClose={handleCloseConjuntosDialog}
        title={selectedProyecto ? `Conjuntos en ${selectedProyecto.nombre}` : "Conjuntos"}
      >
        {conjuntosData.length > 0 ? (
          <List>
            {conjuntosData.map((conjunto,index) => (
              <ListItem
                key={conjunto.id}
                onClick={() => handleShowEstructuras(conjunto)}
                sx={{
                  cursor: "pointer",
                  border: "1px solid #eee",
                  borderRadius: "4px",
                  margin: "8px 0",
                  backgroundColor: "#f9f9f9",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <ListItemText
                  primary={conjunto.nombre}
                  secondary={`Encargado: ${conjunto.residente_encargado?.nombre || "No asignado"} | Tipo: ${conjunto.tipo_vivienda?.nombre || "No definido"} | Progreso: ${porcentajesCompletadosC[index] ?? 0}%`}
                  />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ py: 2 }}>
            No hay conjuntos asociados a este proyecto.
          </Typography>
        )}
      </DialogContainer>

      <DialogContainer
        open={estructurasDialogOpen}
        onClose={handleCloseEstructurasDialog}
        title={selectedConjunto ? `Estructuras en ${selectedConjunto.nombre}` : "Estructuras"}
        actions={
          <Button variant="outlined" color="primary" onClick={handleCloseEstructurasDialog}>
            Volver a conjuntos
          </Button>
        }
      >
        {estructurasData.length > 0 ? (
          <List>
            {estructurasData.map((estructura, index) => (
              <ListItem
                key={estructura.id}
                onClick={() => handleShowActividades(estructura)}
                sx={{
                  cursor: 'pointer',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  margin: '8px 0',
                  backgroundColor: '#f9f9f9',
                  '&:hover': { backgroundColor: '#f0f0f0' },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <ListItemText
                    primary={estructura.nombre}
                    secondary={
                      <>
                        {`Porcentaje: ${porcentajesCompletados[index] || 0}%`}
                        <br />
                        {`Tipo: ${estructura.tipo_estructura?.nombre || 'No definido'}`}
                        <br />
                        {`Estado: ${estructura.estado?.nombre || 'No definido'}`}
                      </>
                    }
                  />
                  <CircularProgressWithLabel value={porcentajesCompletados[index] || 0} />
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ py: 2 }}>
            No hay estructuras asociadas a este conjunto.
          </Typography>
        )}
      </DialogContainer>

      <DialogContainer
        open={actividadesDialogOpen}
        onClose={handleCloseActividadesDialog}
        title={selectedEstructura ? `Actividades de ${selectedEstructura.nombre}` : "Actividades"}
        actions={
          <Button variant="outlined" color="primary" onClick={handleCloseActividadesDialog}>
            Volver a estructuras
          </Button>
        }
      >
        {actividadesData.length > 0 ? (
          <List>
            {actividadesData.map((actividad) => (
              <ListItem
                key={actividad.id}
                onClick={() => handleShowReporte(actividad)}
                sx={{
                  cursor: "pointer",
                  border: "1px solid #eee",
                  borderRadius: "4px",
                  margin: "8px 0",
                  backgroundColor: "#f9f9f9",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                  display: "block",
                  padding: "16px",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="h6">{actividad.actividad?.nombre || "Actividad sin nombre"}</Typography>
                  <Chip
                    label={actividad.estado?.nombre || "Sin estado"}
                    color={getStatusColor(actividad.estado?.nombre || "")}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" gutterBottom>
                  {actividad.descripcion || "Sin descripción"}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                  <Typography variant="caption">Inicio: {formatDate(actividad.fecha_inicio)}</Typography>
                  <Typography variant="caption">Fin: {formatDate(actividad.fecha_fin)}</Typography>
                </Box>
                {actividad.reporte && actividad.reporte.descripcion && (
                  <Box sx={{ mt: 1, p: 1, backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
                    <Typography variant="caption" component="div">
                      <strong>Reporte:</strong> {actividad.reporte.descripcion}
                    </Typography>
                  </Box>
                )}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ py: 2 }}>
            No hay actividades asociadas a esta estructura.
          </Typography>
        )}
      </DialogContainer>

      {selectedActividad && (
        <ReporteForm
          open={reporteFormOpen}
          onClose={handleCloseReporteForm}
          initialData={reporteFormData}
          onSubmit={handleSubmitReporte}
          interventores={interventores}
          residentes={residentes}
          contratistas={contratistas}
          resultados={resultados}
          isEditing={Boolean(selectedActividad.id_reporte)}
        />
      )}
    </Box>
  )
}

export default ProyectosTemplate
