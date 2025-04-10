"use client"

import dynamic from "next/dynamic"

// Importar el componente de login dinámicamente con SSR desactivado
const LoginPageClient = dynamic(() => import("@/components/auth/LoginPage"), { ssr: false })

export default function LoginPage() {
  return <LoginPageClient />
}