import express from 'express';
import adminController from '../controllers/adminController.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// Rutas públicas (no requieren autenticación)
router.post('/login', adminController.login);

// Rutas protegidas (requieren autenticación de admin)
router.post('/logout', adminMiddleware.verificarAdmin, adminController.logout);
router.get('/validate-session', adminMiddleware.verificarAdmin, adminController.validateSession);

export default router;
