"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  CircularProgress,
  Alert,
  CssBaseline,
  InputAdornment,
} from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { AccountCircle as AccountCircleIcon } from "@mui/icons-material"
import { useAuth } from "@/components/auth/AuthContext"

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#673ab7" },
    error: { main: "#f44336" },
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
    h4: { fontWeight: 600 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: "none", borderRadius: 8 } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 12 } } },
  },
})

const LoginPage: React.FC = () => {
  const [cedula, setCedula] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cedula.trim()) {
      setError("Ingrese una cédula válida")
      return
    }
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`http://localhost:4000/persona/verificar-rol/${cedula}`)
      if (!response.ok) {
        throw new Error("Error al verificar credenciales")
      }
      const data = await response.json()
      if (data.result === true) {
        login(cedula)
        router.push("/proyectos")
      } else {
        setError("Credenciales no válidas. No tienes permisos para acceder")
      }
    } catch (err) {
      console.error("Error de inicio de sesión:", err)
      setError("Error al iniciar sesión. Por favor, intente nuevamente más tarde.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            py: 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderTop: "4px solid #1976d2",
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom sx={{ color: "#1976d2" }}>
            IntervenSoft            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Ingresa tu cédula para acceder al sistema
            </Typography>
            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
                {error}
              </Alert>
            )}
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: "100%" }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="cedula"
                label="Cédula"
                name="cedula"
                autoComplete="username"
                autoFocus
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading} sx={{ py: 1.5 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "Ingresar al Sistema"}
              </Button>
            </Box>
          </Paper>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            © {new Date().getFullYear()} Sistema de Gestión de Actividades en Interventoría 
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default LoginPage