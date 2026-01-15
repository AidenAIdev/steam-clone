import adminService from '../services/adminService.js';

const adminController = {
  /**
   * Login de administrador
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos',
        });
      }

      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await adminService.login(email, password, ipAddress, userAgent);

      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        ...result,
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Error al iniciar sesión',
      });
    }
  },

  /**
   * Logout de administrador
   */
  logout: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token no proporcionado',
        });
      }

      const adminId = req.admin?.id; // Viene del middleware
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];

      await adminService.logout(token, adminId, ipAddress, userAgent);

      res.status(200).json({
        success: true,
        message: 'Logout exitoso',
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error al cerrar sesión',
      });
    }
  },

  /**
   * Validar sesión de administrador
   */
  validateSession: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token no proporcionado',
        });
      }

      const result = await adminService.validateSession(token);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error('Error en validación:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Sesión inválida',
      });
    }
  },
};

export default adminController;
