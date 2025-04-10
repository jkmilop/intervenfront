"use client"

import type React from "react"
import { Box, Typography, Button } from "@mui/material"
import type { SvgIconProps } from "@mui/material"

export interface TableHeaderProps {
  /**
   * Título de la tabla
   */
  title: string
  /**
   * Subtítulo opcional
   */
  subtitle?: string
  /**
   * Texto del botón de acción principal
   */
  actionButtonText?: string
  /**
   * Icono del botón de acción principal
   */
  actionButtonIcon?: React.ReactElement<SvgIconProps>
  /**
   * Función a ejecutar al hacer clic en el botón de acción
   */
  onActionButtonClick?: () => void
  /**
   * Contenido adicional a mostrar en el encabezado
   */
  additionalContent?: React.ReactNode
}

/**
 * Componente molecular para el encabezado de la tabla
 */
const TableHeader: React.FC<TableHeaderProps> = ({
  title,
  subtitle,
  actionButtonText,
  actionButtonIcon,
  onActionButtonClick,
  additionalContent,
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
      <Box>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        {additionalContent}
        {actionButtonText && onActionButtonClick && (
          <Button variant="contained" startIcon={actionButtonIcon} onClick={onActionButtonClick}>
            {actionButtonText}
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default TableHeader

