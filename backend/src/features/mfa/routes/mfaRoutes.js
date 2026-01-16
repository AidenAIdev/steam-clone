import express from 'express';
import mfaController from '../controllers/mfaController.js';
import { requireAuth } from '../../../shared/middleware/authMiddleware.js';
import adminMiddleware from '../../admin/middleware/adminMiddleware.js';

const router = express.Router();

/**
 * Rutas protegidas - requieren autenticación de administrador
 */

// Iniciar configuración de MFA
router.post('/setup', requireAuth, adminMiddleware.verificarAdmin, mfaController.setupMFA);

// Verificar código y activar MFA
router.post('/verify-enable', requireAuth, adminMiddleware.verificarAdmin, mfaController.verifyAndEnable);

// Deshabilitar MFA
router.post('/disable', requireAuth, adminMiddleware.verificarAdmin, mfaController.disable);

// Obtener estado de MFA
router.get('/status', requireAuth, adminMiddleware.verificarAdmin, mfaController.getStatus);

// Regenerar códigos de respaldo
router.post('/regenerate-backup-codes', requireAuth, adminMiddleware.verificarAdmin, mfaController.regenerateBackupCodes);

/**
 * Rutas públicas (para login y configuración inicial)
 */

// Iniciar configuración de MFA durante login (primera vez)
router.post('/setup-initial', mfaController.setupInitial);

// Verificar código y activar MFA durante login (primera vez) y completar login
router.post('/verify-enable-initial', mfaController.verifyAndEnableInitial);

// Verificar código durante login (no requiere autenticación previa)
router.post('/verify-login', mfaController.verifyLogin);

export default router;
