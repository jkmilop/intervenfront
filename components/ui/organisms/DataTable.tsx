"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Checkbox,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material"
import { styled, alpha } from "@mui/material/styles"
import TableHeader from "../molecules/TableHeader"
import TableSearch from "../molecules/TableSearch"
import TablePagination from "../molecules/TablePagination"
import TableCellComponent from "../atoms/TableCell"
import type { TableActionProps } from "../atoms/TableAction"
import TableActions from "../molecules/TableActions"

// Tipos
export interface Column<T = any> {
  key: string
  header: string
  width?: string | number
  align?: "left" | "center" | "right"
  sortable?: boolean
  renderCell?: (row: T) => React.ReactNode
  isBold?: boolean
  isChip?: boolean
  chipColorMapping?: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning">
  numeric?: boolean
  hidden?: boolean
}

export interface DataTableProps<T = any> {
  /**
   * Título de la tabla
   */
  title: string
  /**
   * Subtítulo opcional
   */
  subtitle?: string
  /**
   * Columnas de la tabla
   */
  columns: Column<T>[]
  /**
   * Datos a mostrar
   */
  data: T[]
  /**
   * Clave única para identificar cada fila
   */
  idField: keyof T
  /**
   * Indica si se debe mostrar la casilla de selección
   */
  selectable?: boolean
  /**
   * Función a ejecutar cuando cambia la selección
   */
  onSelectionChange?: (selectedIds: Array<any>) => void
  /**
   * Función para generar acciones para cada fila
   */
  getRowActions?: (row: T) => TableActionProps[]
  /**
   * Texto del botón de acción principal
   */
  actionButtonText?: string
  /**
   * Icono del botón de acción principal
   */
  actionButtonIcon?: React.ReactElement
  /**
   * Función a ejecutar al hacer clic en el botón de acción
   */
  onActionButtonClick?: () => void
  /**
   * Indica si se debe mostrar la búsqueda
   */
  searchable?: boolean
  /**
   * Texto de placeholder para la búsqueda
   */
  searchPlaceholder?: string
  /**
   * Función personalizada para filtrar los datos
   */
  customFilter?: (data: T[], searchTerm: string) => T[]
  /**
   * Indica si se debe mostrar la paginación
   */
  paginated?: boolean
  /**
   * Número de elementos por página
   */
  pageSize?: number
  /**
   * Indica si se debe persistir el estado en la URL
   */
  persistState?: boolean
  /**
   * Prefijo para los parámetros de URL
   */
  urlParamPrefix?: string
  /**
   * Función a ejecutar cuando se hace clic en una fila
   */
  onRowClick?: (row: T) => void
  /**
   * Contenido adicional para el encabezado
   */
  headerAdditionalContent?: React.ReactNode
  /**
   * Indica si la tabla está cargando datos
   */
  loading?: boolean
  /**
   * Mensaje a mostrar cuando no hay datos
   */
  emptyMessage?: string
}

// Estilos
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  "&.Mui-selected, &.Mui-selected:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  "& > .MuiTableCell-root": {
    padding: "12px 16px",
  },
  cursor: "pointer",
}))

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-head": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    fontWeight: 600,
  },
}))

/**
 * Componente organismo para mostrar una tabla de datos con funcionalidades avanzadas
 */
function DataTable<T extends Record<string, any>>({
  title,
  subtitle,
  columns,
  data,
  idField,
  selectable = false,
  onSelectionChange,
  getRowActions,
  actionButtonText,
  actionButtonIcon,
  onActionButtonClick,
  searchable = true,
  searchPlaceholder = "Buscar...",
  customFilter,
  paginated = true,
  pageSize = 10,
  persistState = true,
  urlParamPrefix = "table",
  onRowClick,
  headerAdditionalContent,
  loading = false,
  emptyMessage = "No hay datos disponibles",
}: DataTableProps<T>) {
  // Estados
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [selected, setSelected] = useState<Array<any>>([])
  const [isClient, setIsClient] = useState(false)

  // Efecto para marcar cuando estamos en el cliente
  useEffect(() => {
    setIsClient(true)

    // Cargar estado desde la URL
    if (persistState && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)

      // Cargar búsqueda
      const searchParam = params.get(`${urlParamPrefix}_search`)
      if (searchParam) setSearchTerm(searchParam)

      // Cargar página
      const pageParam = params.get(`${urlParamPrefix}_page`)
      if (pageParam) setPage(Number.parseInt(pageParam, 10))

      // Cargar ordenamiento
      const sortKeyParam = params.get(`${urlParamPrefix}_sort_key`)
      const sortDirParam = params.get(`${urlParamPrefix}_sort_dir`) as "asc" | "desc"
      if (sortKeyParam && sortDirParam) {
        setSortConfig({ key: sortKeyParam, direction: sortDirParam })
      }
    }
  }, [persistState, urlParamPrefix])

  // Efecto para actualizar la URL con el estado actual (solo en el cliente)
  useEffect(() => {
    if (persistState && isClient && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)

      // Actualizar búsqueda
      if (searchTerm) {
        params.set(`${urlParamPrefix}_search`, searchTerm)
      } else {
        params.delete(`${urlParamPrefix}_search`)
      }

      // Actualizar página
      if (page > 1) {
        params.set(`${urlParamPrefix}_page`, page.toString())
      } else {
        params.delete(`${urlParamPrefix}_page`)
      }

      // Actualizar ordenamiento
      if (sortConfig) {
        params.set(`${urlParamPrefix}_sort_key`, sortConfig.key)
        params.set(`${urlParamPrefix}_sort_dir`, sortConfig.direction)
      } else {
        params.delete(`${urlParamPrefix}_sort_key`)
        params.delete(`${urlParamPrefix}_sort_dir`)
      }

      // Actualizar URL sin recargar la página
      const newUrl = `${window.location.pathname}?${params.toString()}`
      window.history.replaceState({ path: newUrl }, "", newUrl)
    }
  }, [searchTerm, page, sortConfig, persistState, urlParamPrefix, isClient])

  // Efecto para notificar cambios en la selección
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selected)
    }
  }, [selected, onSelectionChange])

  // Manejadores
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
    setPage(1) // Resetear página al ordenar
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setPage(1) // Resetear página al buscar
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredData.map((row) => row[idField])
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleSelectRow = (id: any) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: Array<any> = []

    if (selectedIndex === -1) {
      newSelected = [...selected, id]
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1)
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1)
    } else if (selectedIndex > 0) {
      newSelected = [...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)]
    }

    setSelected(newSelected)
  }

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row)
    }
  }

  // Filtrar y ordenar datos
  const filteredData = useMemo(() => {
    let result = [...data]

    // Filtrar
    if (searchTerm) {
      if (customFilter) {
        result = customFilter(result, searchTerm)
      } else {
        const lowerCaseSearchTerm = searchTerm.toLowerCase()
        result = result.filter((row) =>
          Object.values(row).some((value) => value && value.toString().toLowerCase().includes(lowerCaseSearchTerm)),
        )
      }
    }

    // Ordenar
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue === bValue) return 0

        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue
        }

        const aString = String(aValue)
        const bString = String(bValue)

        return sortConfig.direction === "asc" ? aString.localeCompare(bString) : bString.localeCompare(aString)
      })
    }

    return result
  }, [data, searchTerm, sortConfig, customFilter])

  // Paginar datos
  const paginatedData = useMemo(() => {
    if (!paginated) return filteredData

    const startIndex = (page - 1) * pageSize
    return filteredData.slice(startIndex, startIndex + pageSize)
  }, [filteredData, page, pageSize, paginated])

  // Calcular total de páginas
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize))

  // Verificar si una fila está seleccionada
  const isSelected = (id: any) => selected.indexOf(id) !== -1

  // Si no estamos en el cliente, renderizar un placeholder
  if (!isClient) {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Paper
          sx={{
            width: "100%",
            mb: 2,
            p: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <CircularProgress />
        </Paper>
      </Box>
    )
  }

  // Renderizar tabla
  return (
    <Box>
      {/* Encabezado */}
      <TableHeader
        title={title}
        subtitle={subtitle}
        actionButtonText={actionButtonText}
        actionButtonIcon={actionButtonIcon}
        onActionButtonClick={onActionButtonClick}
        additionalContent={
          <>
            {searchable && <TableSearch value={searchTerm} onChange={handleSearch} placeholder={searchPlaceholder} />}
            {headerAdditionalContent}
          </>
        }
      />

      {/* Tabla */}
      <Paper sx={{ width: "100%", mb: 2, overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "calc(100vh - 220px)" }}>
          <Table stickyHeader aria-label={title}>
            <StyledTableHead>
              <TableRow>
                {selectable && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={selected.length > 0 && selected.length < filteredData.length}
                      checked={filteredData.length > 0 && selected.length === filteredData.length}
                      onChange={handleSelectAll}
                      inputProps={{ "aria-label": "select all" }}
                    />
                  </TableCell>
                )}

                {columns
                  .filter((column) => !column.hidden)
                  .map((column) => (
                    <TableCell
                      key={column.key}
                      align={column.align || (column.numeric ? "right" : "left")}
                      width={column.width}
                      sortDirection={sortConfig?.key === column.key ? sortConfig.direction : false}
                    >
                      {column.sortable !== false ? (
                        <TableSortLabel
                          active={sortConfig?.key === column.key}
                          direction={sortConfig?.key === column.key ? sortConfig.direction : "asc"}
                          onClick={() => handleSort(column.key)}
                        >
                          <Typography variant="subtitle2">{column.header}</Typography>
                        </TableSortLabel>
                      ) : (
                        <Typography variant="subtitle2">{column.header}</Typography>
                      )}
                    </TableCell>
                  ))}

                {getRowActions && (
                  <TableCell align="center">
                    <Typography variant="subtitle2">Acciones</Typography>
                  </TableCell>
                )}
              </TableRow>
            </StyledTableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.filter((c) => !c.hidden).length + (selectable ? 1 : 0) + (getRowActions ? 1 : 0)}
                    align="center"
                  >
                    <Box sx={{ py: 3, display: "flex", justifyContent: "center" }}>
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.filter((c) => !c.hidden).length + (selectable ? 1 : 0) + (getRowActions ? 1 : 0)}
                    align="center"
                  >
                    <Typography variant="body1" sx={{ py: 2 }}>
                      {emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => {
                  const rowId = row[idField]
                  const isItemSelected = isSelected(rowId)

                  return (
                    <StyledTableRow
                      hover
                      onClick={() => handleRowClick(row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={rowId}
                      selected={isItemSelected}
                    >
                      {selectable && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelectRow(rowId)
                            }}
                            inputProps={{ "aria-labelledby": rowId.toString() }}
                          />
                        </TableCell>
                      )}

                      {columns
                        .filter((column) => !column.hidden)
                        .map((column) => {
                          const value = row[column.key]

                          if (column.renderCell) {
                            return (
                              <TableCell
                                key={`${rowId}-${column.key}`}
                                align={column.align || (column.numeric ? "right" : "left")}
                              >
                                {column.renderCell(row)}
                              </TableCell>
                            )
                          }

                          return (
                            <TableCellComponent
                              key={`${rowId}-${column.key}`}
                              value={value}
                              isBold={column.isBold}
                              isChip={column.isChip}
                              chipColor={
                                column.isChip && column.chipColorMapping && value
                                  ? column.chipColorMapping[value] || "default"
                                  : "default"
                              }
                              align={column.align || (column.numeric ? "right" : "left")}
                            />
                          )
                        })}

                      {getRowActions && (
                        <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                          <TableActions actions={getRowActions(row)} />
                        </TableCell>
                      )}
                    </StyledTableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        {paginated && (
          <TablePagination
            page={page}
            totalPages={totalPages}
            totalItems={filteredData.length}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        )}
      </Paper>
    </Box>
  )
}

export default DataTable

