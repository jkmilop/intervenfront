import type React from "react"
import { Box } from "@mui/material"
import TableAction from "../atoms/TableAction"
import type { TableActionProps } from "../atoms/TableAction"

export interface TableActionsProps {
  /**
   * Lista de acciones a mostrar
   */
  actions: Array<TableActionProps>
  /**
   * Espacio entre acciones
   */
  spacing?: number
  /**
   * Alineación de las acciones
   */
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly"
}

/**
 * Componente molecular que agrupa acciones de tabla
 */
const TableActions: React.FC<TableActionsProps> = ({ actions, spacing = 1, justifyContent = "center" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: spacing,
        justifyContent,
        alignItems: "center",
      }}
    >
      {actions.map((action, index) => (
        <TableAction key={`action-${index}`} {...action} />
      ))}
    </Box>
  )
}

export default TableActions

