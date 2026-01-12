/**
 * Rutas de Autenticación para Desarrolladores (Steamworks)
 * Prefijo: /api/desarrolladores/auth
 */

import express from 'express';
import { developerAuthController } from '../controllers/developerAuthController.js';

const router = express.Router();

// Registro de nuevo desarrollador (RF-001)
router.post('/registro', developerAuthController.registro);

// Inicio de sesión (RF-002)
router.post('/login', developerAuthController.login);

// Cierre de sesión
router.post('/logout', developerAuthController.logout);

// Obtener perfil del desarrollador autenticado
router.get('/perfil', developerAuthController.obtenerPerfil);

// Verificar si es desarrollador válido
router.get('/verificar', developerAuthController.verificarDesarrollador);

// Recuperación de contraseña
router.post('/forgot-password', developerAuthController.forgotPassword);
router.post('/reset-password', developerAuthController.resetPassword);

export default router;
