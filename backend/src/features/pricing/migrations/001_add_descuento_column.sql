-- ============================================================================
-- MIGRACIÓN: Agregar campo descuento a aplicaciones_desarrolladores
-- Fecha: 18 de Enero, 2026
-- Descripción: Agrega soporte para descuentos en las aplicaciones
-- ============================================================================

-- Agregar columna descuento (valor entre 0 y 1, donde 0 = 0% y 1 = 100%)
ALTER TABLE public.aplicaciones_desarrolladores 
ADD COLUMN IF NOT EXISTS descuento DECIMAL(3, 2) DEFAULT 0.00 
CHECK (descuento >= 0 AND descuento <= 1);

-- Comentario descriptivo
COMMENT ON COLUMN public.aplicaciones_desarrolladores.descuento IS 
'Descuento aplicable al precio base (0.00 = 0%, 1.00 = 100%)';

-- ============================================================================
-- FIN DE MIGRACIÓN
-- ============================================================================
