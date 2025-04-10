'use client'
import dynamic from "next/dynamic"

// Importar el componente de forma dinámica con SSR desactivado
const ProyectosPageClient = dynamic(() => import("@/components/pages/ProyectosPage"), { ssr: false })

export default function ProyectosPage() {
  return <ProyectosPageClient />
}