import supabase from '../config/supabase.js';

/**
 * Middleware para requerir autenticación de usuario normal
 */
export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token de autorización no proporcionado'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verificar token con Supabase
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (userError || !user) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido o expirado'
            });
        }

        // Adjuntar usuario al request
        req.user = user;
        next();
    } catch (error) {
        console.error('[AUTH MIDDLEWARE] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno de autenticación'
        });
    }
};

/**
 * Middleware opcional para identificar al usuario si existe token, pero no bloquea
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const { data: { user } } = await supabase.auth.getUser(token);
            if (user) {
                req.user = user;
            }
        }
        next();
    } catch (error) {
        next();
    }
};
