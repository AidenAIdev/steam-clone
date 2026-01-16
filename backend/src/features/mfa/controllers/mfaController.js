import mfaService from '../services/mfaService.js';

const mfaController = {
  /**
   * Inicia la configuración de MFA - genera secreto y QR
   */
  setupMFA: async (req, res) => {
    try {
      const adminId = req.user.id;
      const email = req.user.email;

      const result = await mfaService.generateMFASecret(adminId, email);

      res.status(200).json({
        success: true,
        message: 'MFA configurado. Escanea el código QR con tu aplicación autenticadora.',
        data: {
          qrCode: result.qrCode,
          secret: result.secret,
          manualEntryKey: result.manualEntryKey
        }
      });
    } catch (error) {
      console.error('Error al configurar MFA:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al configurar MFA'
      });
    }
  },

  /**
   * Verifica el código TOTP y activa MFA
   */
  verifyAndEnable: async (req, res) => {
    try {
      const adminId = req.user.id;
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Código de verificación requerido'
        });
      }

      const result = await mfaService.verifyAndEnableMFA(adminId, token);

      res.status(200).json({
        success: true,
        message: 'MFA activado exitosamente. Guarda tus códigos de respaldo en un lugar seguro.',
        backupCodes: result.backupCodes
      });
    } catch (error) {
      console.error('Error al verificar y activar MFA:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Código de verificación inválido'
      });
    }
  },

  /**
   * Verifica código TOTP durante login
   */
  verifyLogin: async (req, res) => {
    try {
      const { adminId, token } = req.body;

      if (!adminId || !token) {
        return res.status(400).json({
          success: false,
          message: 'Admin ID y código de verificación requeridos'
        });
      }

      const verified = await mfaService.verifyTOTP(adminId, token);

      if (!verified) {
        return res.status(401).json({
          success: false,
          message: 'Código de verificación inválido'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Código verificado correctamente'
      });
    } catch (error) {
      console.error('Error al verificar código de login:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Error al verificar código'
      });
    }
  },

  /**
   * Deshabilita MFA para el admin
   */
  disable: async (req, res) => {
    try {
      const adminId = req.user.id;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Contraseña requerida para deshabilitar MFA'
        });
      }

      // Aquí podrías agregar verificación de contraseña adicional
      
      await mfaService.disableMFA(adminId);

      res.status(200).json({
        success: true,
        message: 'MFA deshabilitado exitosamente'
      });
    } catch (error) {
      console.error('Error al deshabilitar MFA:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al deshabilitar MFA'
      });
    }
  },

  /**
   * Obtiene el estado de MFA del admin
   */
  getStatus: async (req, res) => {
    try {
      const adminId = req.user.id;

      const status = await mfaService.checkMFAStatus(adminId);

      res.status(200).json({
        success: true,
        data: status
      });
    } catch (error) {
      console.error('Error al obtener estado de MFA:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al obtener estado de MFA'
      });
    }
  },

  /**
   * Regenera códigos de respaldo
   */
  regenerateBackupCodes: async (req, res) => {
    try {
      const adminId = req.user.id;

      const backupCodes = await mfaService.regenerateBackupCodes(adminId);

      res.status(200).json({
        success: true,
        message: 'Códigos de respaldo regenerados',
        backupCodes
      });
    } catch (error) {
      console.error('Error al regenerar códigos de respaldo:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al regenerar códigos de respaldo'
      });
    }
  },

  /**
   * Inicia la configuración de MFA durante login inicial (sin autenticación previa)
   */
  setupInitial: async (req, res) => {
    try {
      const { adminId, email, tempToken } = req.body;

      if (!adminId || !email || !tempToken) {
        return res.status(400).json({
          success: false,
          message: 'Datos incompletos'
        });
      }

      // Verificar el token temporal
      const { supabaseAdmin } = await import('../../../shared/config/supabase.js');
      const { data: admin, error: adminError } = await supabaseAdmin
        .from('admins')
        .select('id')
        .eq('id', adminId)
        .single();

      if (adminError || !admin) {
        return res.status(401).json({
          success: false,
          message: 'Sesión inválida'
        });
      }

      const result = await mfaService.generateMFASecret(adminId, email);

      res.status(200).json({
        success: true,
        message: 'MFA configurado. Escanea el código QR con tu aplicación autenticadora.',
        data: {
          qrCode: result.qrCode,
          secret: result.secret,
          manualEntryKey: result.manualEntryKey
        }
      });
    } catch (error) {
      console.error('Error al configurar MFA inicial:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error al configurar MFA'
      });
    }
  },

  /**
   * Verifica el código TOTP, activa MFA y completa el login inicial
   */
  verifyAndEnableInitial: async (req, res) => {
    try {
      const { adminId, token, tempToken } = req.body;

      if (!adminId || !token || !tempToken) {
        return res.status(400).json({
          success: false,
          message: 'Datos incompletos'
        });
      }

      // Verificar el código y activar MFA
      const result = await mfaService.verifyAndEnableMFA(adminId, token);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Código de verificación inválido'
        });
      }

      // Completar el login creando la sesión
      const adminService = (await import('../../admin/services/adminService.js')).default;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];
      
      const loginResult = await adminService.completeMFALogin(adminId, ipAddress, userAgent);

      res.status(200).json({
        success: true,
        message: 'MFA activado exitosamente y login completado',
        backupCodes: result.backupCodes,
        ...loginResult
      });
    } catch (error) {
      console.error('Error al verificar y activar MFA inicial:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Error al activar MFA'
      });
    }
  }
};

export default mfaController;
