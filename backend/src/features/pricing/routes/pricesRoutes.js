import express from 'express';
import { getDeveloperGames, updateGamePrice } from '../controllers/priceController';
import { verifyJWT } from '../../../shared/middleware/authMiddleware'; // Middleware común
import { verifyMFA } from '../../../featured/mfa'; // Requisito RNF-001

const router = express.Router();


router.get('/my-games', verifyJWT, getDeveloperGames); // Obtener lista para el dropdown
router.put('/update-price', verifyJWT, verifyMFA, updateGamePrice); // Acción protegida

export default router;


