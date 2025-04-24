"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  usuario: string | null
  id_rol: string | null
  token: string | null
  login: (id_rol: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [usuario, setUsuario] = useState<string | null>(null)
  const [id_rol, setRol] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      const publicPaths = ["/login"]
      const isPublicPath = publicPaths.includes(pathname || "")
      if (!isAuthenticated && !isPublicPath) {
        router.push("/login")
      } else if (isAuthenticated && isPublicPath) {
        console.log("Autenticado, redireccionando a /proyectos")
        router.push("/proyectos")
      }
    }
  }, [isAuthenticated, loading, pathname, router])

  const login = (id_rol: string) => {
    setIsAuthenticated(true)
    setRol(id_rol)
    router.push("/proyectos")
  }
        
  const logout = () => {
    setIsAuthenticated(false)
    setToken(null)
    setUsuario(null)
    setRol(null)
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    localStorage.removeItem("id_rol")
    router.push("/login")
  }

  const value: AuthContextType = {
    isAuthenticated,
    usuario,
    id_rol,
    token,
    login,
    logout,
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Cargando...
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext