"use client"

import React from "react"
import { IconButton, Tooltip } from "@mui/material"
import type { SvgIconProps } from "@mui/material"

export interface TableActionProps {
  /**
   * Texto que se mostrará en el tooltip
   */
  tooltip: string
  /**
   * Icono a mostrar en el botón
   */
  icon: React.ReactElement<SvgIconProps>
  /**
   * Función a ejecutar al hacer clic
   */
  onClick: () => void
  /**
   * Color del botón
   */
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning"
  /**
   * Indica si el botón está deshabilitado
   */
  disabled?: boolean
  /**
   * Texto para lectores de pantalla
   */
  ariaLabel?: string
}

/**
 * Componente atómico para representar una acción en la tabla
 */
const TableAction: React.FC<TableActionProps> = ({
  tooltip,
  icon,
  onClick,
  color = "primary",
  disabled = false,
  ariaLabel,
}) => {
  return (
    <Tooltip title={tooltip}>
      <span>
        <IconButton size="small" onClick={onClick} color={color} disabled={disabled} aria-label={ariaLabel || tooltip}>
          {React.cloneElement(icon, { fontSize: "small" })}
        </IconButton>
      </span>
    </Tooltip>
  )
}

export default TableAction

