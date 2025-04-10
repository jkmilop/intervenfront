import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/components/auth/AuthContext"

export const metadata: Metadata = {
  title: "Sistema de Gestión",
  description: "Sistema de gestión de actividades en interventoría civil",
    
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

import './globals.css'