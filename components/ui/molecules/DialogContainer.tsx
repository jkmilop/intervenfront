"use client"

import type React from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton } from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"

interface DialogContainerProps {
  /**
   * Indica si el diálogo está abierto
   */
  open: boolean
  /**
   * Función para cerrar el diálogo
   */
  onClose: () => void
  /**
   * Título del diálogo
   */
  title: string
  /**
   * Contenido del diálogo
   */
  children: React.ReactNode
  /**
   * Acciones del diálogo (botones)
   */
  actions?: React.ReactNode
  /**
   * Ancho máximo del diálogo
   */
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false
  /**
   * Indica si el diálogo debe ocupar todo el ancho disponible
   */
  fullWidth?: boolean
}

/**
 * Componente para mostrar un diálogo con título, contenido y acciones
 */
const DialogContainer: React.FC<DialogContainerProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "md",
  fullWidth = true,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">{title}</Typography>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  )
}

export default DialogContainer

