"use client"

import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import ProyectosTemplate from "@/components/templates/ProyectosTemplate"
import NavBar from "@/components/ui/organisms/NavBar"
import { proyectosService } from "@/lib/api-service"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/AuthContext"

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#673ab7" },
    error: { main: "#f44336" },
    success: { main: "#4caf50" },
    info: { main: "#2196f3" },
    background: { default: "#f5f5f5" },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h6: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
  },
  components: {
    MuiTableRow: {
      styleOverrides: { root: { "&:last-child td, &:last-child th": { borderBottom: 0 } } },
    },
    MuiTableCell: {
      styleOverrides: { root: { borderBottom: "1px solid rgba(224, 224, 224, 0.4)" } },
    },
    MuiButton: {
      styleOverrides: { root: { textTransform: "none", borderRadius: 8 } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 4 } },
    },
  },
})

export default function ProyectosPage() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar title="Proyectos" onLogout={logout}>
        <ProyectosTemplate
          fetchCiudades={proyectosService.fetchCiudades}
          fetchProyectos={proyectosService.fetchProyectos}
          addProyecto={proyectosService.addProyecto}
          updateProyecto={proyectosService.updateProyecto}
          deleteProyecto={proyectosService.deleteProyecto}
        />
      </NavBar>
    </ThemeProvider>
  )
}