"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { styled } from "@mui/material/styles"
import {
  AppBar,
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  TextField,
  InputAdornment,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Details as DetailsIcon,
  Quiz as QuizIcon,
} from "@mui/icons-material"

// Interfaces
interface ProyectoData {
  id: number
  nombre: string
  direccion: string
  id_ciudad: number
  ciudad: {
    nombre: string
  }
  estado: {
    nombre: string
  }
}
const [onlyLinked, setOnlyLinked] = useState(false)

interface Column {
  key: string
  header: string
  isCurrency?: boolean
  numeric?: boolean
}

interface Row {
  id: number | string
  [key: string]: any
}

// Styled components
const drawerWidth = 64

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  }),
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "&.Mui-selected, &.Mui-selected:hover": {
    backgroundColor: theme.palette.action.selected,
  },
  "& > .MuiTableCell-root": {
    padding: "12px 16px",
  },
}))

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-head": {
    backgroundColor: theme.palette.grey[50],
    fontWeight: 600,
  },
}))

const SearchTextField = styled(TextField)(({ theme }) => ({
  width: 300,
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius * 2,
  },
}))

// Custom Dialog Component to avoid Material UI Dialog issues
const SimpleDialog = ({ open, onClose, title, children, actions }: any) => {
  if (!open) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1300,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "24px",
          width: "500px",
          maxWidth: "90%",
          maxHeight: "90%",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ margin: "0 0 16px 0" }}>{title}</h2>
        <div>{children}</div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px", gap: "8px" }}>{actions}</div>
      </div>
    </div>
  )
}

// Custom Alert Component to avoid Material UI Snackbar issues
const SimpleAlert = ({ type, message, onClose }: any) => {
  if (!message) return null

  const bgColor = type === "error" ? "#f44336" : "#4caf50"
  const textColor = "white"

  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        backgroundColor: bgColor,
        color: textColor,
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
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: textColor,
          cursor: "pointer",
          marginLeft: "16px",
          fontSize: "16px",
        }}
      >
        ×
      </button>
    </div>
  )
}

// Data service
const useProyectoService = () => {
  const [proyectosData, setProyectosData] = useState<ProyectoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const baseUrl = "http://localhost:4000/proyecto"

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(baseUrl)
      if (!response.ok) {
        throw new Error("Failed to fetch proyecto data")
      }
      const data = await response.json()
      setProyectosData(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching proyecto data:", error)
      setError("Failed to fetch proyecto data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const addProyecto = async (newRow: Omit<Row, "id">) => {
    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRow),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to add new proyecto: ${errorData.message || "Internal server error"}`)
      }

      const addedProyecto: ProyectoData = await response.json()
      setSuccess("Proyecto added successfully.")
      setProyectosData([...proyectosData, addedProyecto])
      return addedProyecto
    } catch (error) {
      console.error("Error adding new proyecto:", error)
      setError(`Failed to add new proyecto: ${error instanceof Error ? error.message : "Unknown error"}`)
      throw error
    }
  }

  const updateProyecto = async (editedRow: Row) => {
    try {
      const response = await fetch(`${baseUrl}/${editedRow.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedRow),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to edit proyecto: ${errorData.message || "Internal server error"}`)
      }

      const updatedProyecto: ProyectoData = await response.json()
      setSuccess("Proyecto edited successfully.")
      setProyectosData(
        proyectosData.map((proyecto) => (proyecto.id === updatedProyecto.id ? updatedProyecto : proyecto)),
      )
      return updatedProyecto
    } catch (error) {
      console.error("Error editing proyecto:", error)
      setError(`Failed to edit proyecto: ${error instanceof Error ? error.message : "Unknown error"}`)
      throw error
    }
  }

  const deleteProyecto = async (id: number | string) => {
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to delete proyecto: ${errorData.message || "Internal server error"}`)
      }

      setSuccess("Proyecto deleted successfully.")
      setProyectosData(proyectosData.filter((proyecto) => proyecto.id !== id))
      return true
    } catch (error) {
      console.error("Error deleting proyecto:", error)
      setError(`Failed to delete proyecto: ${error instanceof Error ? error.message : "Unknown error"}`)
      throw error
    }
  }

  const clearError = () => setError(null)
  const clearSuccess = () => setSuccess(null)

  return {
    proyectosData,
    loading,
    error,
    success,
    fetchData,
    addProyecto,
    updateProyecto,
    deleteProyecto,
    clearError,
    clearSuccess,
  }
}

// Main component
export default function DataGridTable() {
  const {
    proyectosData,
    loading,
    error,
    success,
    fetchData,
    addProyecto,
    updateProyecto,
    deleteProyecto,
    clearError,
    clearSuccess,
  } = useProyectoService()

  const [selected, setSelected] = useState<string[]>([])
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRow, setEditingRow] = useState<Row | null>(null)
  const [formData, setFormData] = useState<Partial<Row>>({})

  // Define columns
  const columns: Column[] = [
    { key: "id", header: "ID" },
    { key: "nombre", header: "Nombre" },
    { key: "direccion", header: "Dirección" },
    { key: "id_ciudad", header: "ID Ciudad", numeric: true },
    { key: "ciudad", header: "Ciudad" },
    { key: "estado", header: "Estado" },
  ]

  // Generate table data from proyectos data
  const generateTableData = (data: ProyectoData[] = []): Row[] => {
    return data.map((proyecto) => ({
      id: proyecto.id,
      nombre: proyecto.nombre,
      direccion: proyecto.direccion,
      id_ciudad: proyecto.id_ciudad,
      ciudad: proyecto.ciudad?.nombre || "",
      estado: proyecto.estado?.nombre || "",
    }))
  }

  // Effect to fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])

  // Handle row selection
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredData.map((n) => n.id.toString())
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleRowClick = (id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    setSelected(newSelected)
  }

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  // Handle sorting
  const handleSort = (columnKey: string) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key: columnKey, direction })
  }

  // Filter and sort data
  const dataToDisplay = onlyLinked
    ? proyectosData.filter((p: any) => p.conjuntos && p.conjuntos.some((c: any) => c.estructuras && c.estructuras.length > 0))
    : proyectosData

  const filteredData = generateTableData(dataToDisplay)
    .filter((row) =>
      Object.values(row).some((value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      if (!sortConfig) return 0

      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal
      }

      const aStr = String(aVal || "")
      const bStr = String(bVal || "")

      return sortConfig.direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
    })  // Dialog handlers
  const handleOpenDialog = (row: Row | null = null) => {
    setEditingRow(row)
    setFormData(row ? { ...row } : {})
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingRow(null)
    setFormData({})
  }

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    try {
      if (editingRow) {
        await updateProyecto({ ...editingRow, ...formData })
      } else {
        await addProyecto(formData as Omit<Row, "id">)
      }
      handleCloseDialog()
    } catch (error) {
      // Error is already handled in the service
    }
  }

  // Row action handler
  const handleRowAction = (id: number | string, actionType: string) => {
    console.log(`Action ${actionType} on row ${id}`)
    // Implement specific actions here
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Custom Alerts */}
      {error && <SimpleAlert type="error" message={error} onClose={clearError} />}
      {success && <SimpleAlert type="success" message={success} onClose={clearSuccess} />}

      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)`,
          ml: `${drawerOpen ? drawerWidth : 0}px`,
          bgcolor: "#1976d2",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Proyectos
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
      >
        <Toolbar />
        <List>
          <ListItem button sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <ListItemIcon sx={{ minWidth: 0 }}>
              <DashboardIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem button sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <ListItemIcon sx={{ minWidth: 0 }}>
              <PeopleIcon />
            </ListItemIcon>
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Main open={drawerOpen}>
        <Toolbar />
        <Box sx={{ p: 3 }}>
          {/* Search and Actions Bar */}
          {/* Search and Actions Bar */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <SearchTextField
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="small"
              />
              <Checkbox
                checked={onlyLinked}
                onChange={(e) => setOnlyLinked(e.target.checked)}
                inputProps={{ 'aria-label': 'mostrar solo proyectos vinculados' }}
                sx={{ ml: 2 }}
              />
              <Typography variant="body2" sx={{ ml: 1 }}>Mostrar solo proyectos vinculados</Typography>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
              Nuevo Proyecto
            </Button>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <SearchTextField
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="small"
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ ml: 2 }}
              >
                Nuevo Proyecto
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOnlyLinked(!onlyLinked)}
                sx={{ ml: 2 }}
              >
                {onlyLinked  ? "Mostrar Todas" : "Filtrar Estructuras Vinculadas"}
              </Button>
            </Box>

          </Box>

          {/* Table */}
          <Paper sx={{ width: "100%", mb: 2, overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: "calc(100vh - 220px)" }}>
              <Table stickyHeader aria-label="sticky table">
                <StyledTableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={selected.length > 0 && selected.length < filteredData.length}
                        checked={filteredData.length > 0 && selected.length === filteredData.length}
                        onChange={handleSelectAllClick}
                        inputProps={{
                          "aria-label": "select all proyectos",
                        }}
                      />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.key} align={column.numeric ? "right" : "left"}>
                        <TableSortLabel
                          active={sortConfig?.key === column.key}
                          direction={sortConfig?.key === column.key ? sortConfig.direction : "asc"}
                          onClick={() => handleSort(column.key)}
                        >
                          <Typography variant="subtitle2">{column.header}</Typography>
                        </TableSortLabel>
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <Typography variant="subtitle2">Acciones</Typography>
                    </TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {filteredData.length > 0 ? (
                    filteredData.map((row) => {
                      const isItemSelected = isSelected(row.id.toString())
                      return (
                        <StyledTableRow
                          hover
                          onClick={() => handleRowClick(row.id.toString())}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": row.id.toString(),
                              }}
                            />
                          </TableCell>
                          {columns.map((column) => (
                            <TableCell key={`${row.id}-${column.key}`} align={column.numeric ? "right" : "left"}>
                              {column.key === "nombre" ? (
                                <Typography sx={{ fontWeight: 600 }}>{row[column.key]}</Typography>
                              ) : column.key === "estado" ? (
                                <Chip
                                  label={row[column.key]}
                                  size="small"
                                  color={row[column.key] === "Activo" ? "success" : "default"}
                                />
                              ) : (
                                row[column.key]
                              )}
                            </TableCell>
                          ))}
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleOpenDialog(row)
                              }}
                              color="primary"
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteProyecto(row.id)
                              }}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRowAction(row.id, "details")
                              }}
                              color="info"
                            >
                              <DetailsIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRowAction(row.id, "evaluate")
                              }}
                              color="secondary"
                            >
                              <QuizIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </StyledTableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length + 2} align="center">
                        <Typography variant="body1" sx={{ py: 2 }}>
                          No se encontraron proyectos
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                p: 2,
                borderTop: "1px solid rgba(224, 224, 224, 0.4)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                  {`1–${filteredData.length} de ${filteredData.length}`}
                </Typography>
                <IconButton disabled={true} size="small">
                  <KeyboardArrowLeft />
                </IconButton>
                <IconButton disabled={true} size="small">
                  <KeyboardArrowRight />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Main>

      {/* Custom Dialog */}
      <SimpleDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title={editingRow ? "Editar Proyecto" : "Nuevo Proyecto"}
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
        {columns.map(
          (column) =>
            column.key !== "id" &&
            column.key !== "estado" && (
              <TextField
                key={column.key}
                name={column.key}
                label={column.header}
                value={formData[column.key] || ""}
                onChange={(e) => handleInputChange(column.key, e.target.value)}
                fullWidth
                margin="normal"
                type={column.numeric ? "number" : "text"}
              />
            ),
        )}
      </SimpleDialog>
    </Box>
  )
}

