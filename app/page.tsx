"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import ClientOnly from "@/components/ClientOnly"
import { useAuth } from "@/components/auth/AuthContext"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/proyectos")
    } else {
      router.push("/login")
    }
  }, [router, isAuthenticated])

  return (
    <ClientOnly fallback={<div>Cargando...</div>}>
      <div>Redirigiendo...</div>
    </ClientOnly>
  )
}