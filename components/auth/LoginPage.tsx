"use client"

import React, { useState } from "react"
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
import { AccountCircle as AccountCircleIcon, Lock as LockIcon } from "@mui/icons-material"
import { useAuth } from "@/components/auth/AuthContext"

const theme = createTheme({
  // ...igual que antes...
})

const LoginPage: React.FC = () => {
  const [usuario, setUsuario] = useState("")
  const [contraseña, setContraseña] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { login } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usuario.trim() || !contraseña.trim()) {
      setError("Ingrese usuario y contraseña")
      return
    }
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("http://localhost:4000/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contraseña }),
        credentials: "include", // 🔥 ESTO ES CLAVE
      })
      if (!response.ok) {
        throw new Error("Credenciales incorrectas")
      }
      const data = await response.json()
      // Guarda el token y el rol en el contexto o localStorage
      login(data.id_rol) // si decides mantener id_rol
      console.log("Login correcto, id rol:", data.id_rol)

      router.push("/proyectos")
    } catch (err) {
      setError("Usuario o contraseña incorrectos")
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
              IntervenSoft
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Ingresa tu usuario y contraseña para acceder al sistema
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
                id="usuario"
                label="Usuario"
                name="usuario"
                autoComplete="username"
                autoFocus
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="contraseña"
                label="Contraseña"
                name="contraseña"
                type="password"
                autoComplete="current-password"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
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