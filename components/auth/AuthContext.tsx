"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  userCedula: string | null
  login: (cedula: string) => void
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
  const [userCedula, setUserCedula] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Verificar la autenticación usando localStorage y la cookie
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated")
    const storedUserCedula = localStorage.getItem("userCedula")
    const cookieAuth = document.cookie.includes("isAuthenticated=true")
    if ((storedIsAuthenticated === "true" && storedUserCedula) || cookieAuth) {
      setIsAuthenticated(true)
      setUserCedula(storedUserCedula)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      const publicPaths = ["/login"]
      const isPublicPath = publicPaths.includes(pathname || "")
      if (!isAuthenticated && !isPublicPath) {
        router.push("/login")
      } else if (isAuthenticated && isPublicPath) {
        router.push("/proyectos")
      }
    }
  }, [isAuthenticated, loading, pathname, router])

  const login = (cedula: string) => {
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userCedula", cedula)
    document.cookie = "isAuthenticated=true; path=/; max-age=3600"
    setIsAuthenticated(true)
    setUserCedula(cedula)
  }

  const logout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userCedula")
    document.cookie = "isAuthenticated=; path=/; max-age=0"
    setIsAuthenticated(false)
    setUserCedula(null)
    router.push("/login")
  }

  const value: AuthContextType = {
    isAuthenticated,
    userCedula,
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
