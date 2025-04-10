"use client"

import type React from "react"
import { TextField, InputAdornment } from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import { styled } from "@mui/material/styles"

const SearchTextField = styled(TextField)(({ theme }) => ({
  width: 300,
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius * 2,
  },
}))

export interface TableSearchProps {
  /**
   * Valor actual de búsqueda
   */
  value: string
  /**
   * Función a ejecutar cuando cambia el valor
   */
  onChange: (value: string) => void
  /**
   * Texto de placeholder
   */
  placeholder?: string
  /**
   * Ancho del campo de búsqueda
   */
  width?: number | string
}

/**
 * Componente molecular para la búsqueda en la tabla
 */
const TableSearch: React.FC<TableSearchProps> = ({ value, onChange, placeholder = "Buscar...", width = 300 }) => {
  return (
    <SearchTextField
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      variant="outlined"
      size="small"
      sx={{ width }}
    />
  )
}

export default TableSearch

