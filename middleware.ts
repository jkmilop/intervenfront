import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Verificar si el usuario está autenticado
  const isAuthenticated = request.cookies.get("isAuthenticated")?.value === "true"

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login"]

  // Obtener la ruta actual
  const { pathname } = request.nextUrl

  // Si el usuario no está autenticado y la ruta no es pública, redirigir al login
  if (!isAuthenticated && !publicRoutes.includes(pathname) && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Si el usuario está autenticado e intenta acceder al login, redirigir a proyectos
  if (isAuthenticated && (publicRoutes.includes(pathname) || pathname === "/")) {
    return NextResponse.redirect(new URL("/proyectos", request.url))
  }

  return NextResponse.next()
}

// Configurar las rutas a las que aplica el middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}