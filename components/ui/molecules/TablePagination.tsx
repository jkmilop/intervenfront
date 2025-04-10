"use client"

import type React from "react"
import { Box, Typography, IconButton } from "@mui/material"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"

export interface TablePaginationProps {
  /**
   * Página actual
   */
  page: number
  /**
   * Número total de páginas
   */
  totalPages: number
  /**
   * Número total de elementos
   */
  totalItems: number
  /**
   * Número de elementos por página
   */
  pageSize: number
  /**
   * Función a ejecutar cuando cambia la página
   */
  onPageChange: (newPage: number) => void
}

/**
 * Componente molecular para la paginación de la tabla
 */
const TablePagination: React.FC<TablePaginationProps> = ({ page, totalPages, totalItems, pageSize, onPageChange }) => {
  const from = Math.min(totalItems, (page - 1) * pageSize + 1)
  const to = Math.min(totalItems, page * pageSize)

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, alignItems: "center" }}>
      <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
        {`${from}–${to} de ${totalItems}`}
      </Typography>
      <IconButton disabled={page <= 1} onClick={() => onPageChange(page - 1)} size="small" aria-label="Página anterior">
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        size="small"
        aria-label="Página siguiente"
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  )
}

export default TablePagination

