import type React from "react"
import { TableCell as MuiTableCell, Typography, Chip } from "@mui/material"
import type { TableCellProps as MuiTableCellProps } from "@mui/material"

export interface TableCellProps extends MuiTableCellProps {
  /**
   * Valor a mostrar en la celda
   */
  value: any
  /**
   * Indica si el valor debe mostrarse como un chip
   */
  isChip?: boolean
  /**
   * Indica si el valor debe mostrarse en negrita
   */
  isBold?: boolean
  /**
   * Color del chip (solo si isChip es true)
   */
  chipColor?: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
  /**
   * Función para renderizar contenido personalizado
   */
  renderCustomContent?: (value: any) => React.ReactNode
}

/**
 * Componente atómico para representar una celda de tabla con diferentes formatos
 */
const TableCellComponent: React.FC<TableCellProps> = ({
  value,
  isChip = false,
  isBold = false,
  chipColor = "default",
  renderCustomContent,
  ...props
}) => {
  const renderContent = () => {
    if (renderCustomContent) {
      return renderCustomContent(value)
    }

    if (isChip) {
      return <Chip label={value} size="small" color={chipColor} />
    }

    if (isBold) {
      return <Typography sx={{ fontWeight: 600 }}>{value}</Typography>
    }

    return value
  }

  return <MuiTableCell {...props}>{renderContent()}</MuiTableCell>
}

export default TableCellComponent

