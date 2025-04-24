"use client"

import React from "react"
import { TextField, FormControl, InputLabel, Select, MenuItem, Grid, Button } from "@mui/material"
import DialogContainer from "./DialogContainer"
import type { PersonaOption, ResultadoOption, ReporteFormData } from "@/lib/api-service"

interface ReporteFormProps {
  /**
   * Indica si el formulario está abierto
   */
  open: boolean
  /**
   * Función para cerrar el formulario
   */
  onClose: () => void
  /**
   * Datos iniciales del formulario
   */
  initialData: ReporteFormData
  /**
   * Función para enviar el formulario
   */
  onSubmit: (data: ReporteFormData) => Promise<void>

  /**
   * Lista de interventores disponibles
   */
  interventores: PersonaOption[]
  /**
   * Lista de residentes disponibles
   */
  residentes: PersonaOption[]
  /**
   * Lista de contratistas disponibles
   */
  contratistas: PersonaOption[]
  /**
   * Lista de resultados disponibles
   */
  resultados: ResultadoOption[]
  /**
   * Indica si se está editando un reporte existente
   */
  isEditing: boolean
}

/**
 * Formulario para crear o editar un reporte
 */
const ReporteForm: React.FC<ReporteFormProps> = ({
  open,
  onClose,
  initialData,
  onSubmit,
  interventores,
  residentes,
  contratistas,
  resultados,
  isEditing,
}) => {
  const [formData, setFormData] = React.useState<ReporteFormData>(initialData)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Actualizar formData cuando cambian los datos iniciales
  React.useEffect(() => {
    setFormData(initialData)
  }, [initialData])

  const handleChange = (field: keyof ReporteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)
      await onSubmit(formData)
      onClose()
    } catch (err) {
      console.error("Error al enviar formulario:", err)
      setError(err instanceof Error ? err.message : "Error al guardar el reporte")
    } finally {
      setLoading(false)
    }
  }
  return (
    <DialogContainer
      open={open}
      onClose={onClose}
      title={isEditing ? "Editar Reporte" : "Nuevo Reporte"}
      actions={
        <>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </>
      }
    >
      <Grid container spacing={2}>
        {error && (
          <Grid item xs={12}>
            <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            label="Descripción del reporte"
            value={formData.descripcion_reporte}
            onChange={(e) => handleChange("descripcion_reporte", e.target.value)}
            fullWidth
            multiline
            rows={4}
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel id="interventor-label">Interventor</InputLabel>
            <Select
              labelId="interventor-label"
              value={formData.interventor}
              label="Interventor"
              onChange={(e) => handleChange("interventor", e.target.value as string)}
            >
              {interventores.map((interventor) => (
                <MenuItem key={interventor.id} value={interventor.id.toString()}>
                  {interventor.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel id="residente-label">Residente</InputLabel>
            <Select
              labelId="residente-label"
              value={formData.residente}
              label="Residente"
              onChange={(e) => handleChange("residente", e.target.value as string)}
            >
              {residentes.map((residente) => (
                <MenuItem key={residente.id} value={residente.id.toString()}>
                  {residente.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel id="contratista-label">Contratista</InputLabel>
            <Select
              labelId="contratista-label"
              value={formData.contratista}
              label="Contratista"
              onChange={(e) => handleChange("contratista", e.target.value as string)}
            >
              {contratistas.map((contratista) => (
                <MenuItem key={contratista.id} value={contratista.id.toString()}>
                  {contratista.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel id="resultado-label">Resultado</InputLabel>
            <Select
              labelId="resultado-label"
              value={formData.resultado}
              label="resultado"
              onChange={(e) => handleChange("resultado", e.target.value as string)}
            >
              {Array.isArray(resultados) ? resultados.map(resultado => (
                <MenuItem key={resultado.id} value={resultado.id.toString()}>
                  {resultado.nombre}
                </MenuItem>
              )) : null}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </DialogContainer>
  )
}

export default ReporteForm

