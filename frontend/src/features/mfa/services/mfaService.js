/**
 * Servicio de MFA
 * Por el momento solo implementado para el módulo de administración
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const mfaService = {
  /**
   * Iniciar configuración de MFA durante login inicial (sin token de sesión)
   */
  setupInitial: async (adminId, email, tempToken) => {
    try {
      const response = await fetch(`${API_URL}/mfa/setup-initial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminId, email, tempToken })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al configurar MFA');
      }

      return data;
    } catch (error) {
      console.error('Error al configurar MFA inicial:', error);
      throw error;
    }
  },

  /**
   * Verificar código TOTP, activar MFA y completar login inicial
   */
  verifyAndEnableInitial: async (adminId, totpCode, tempToken) => {
    try {
      const response = await fetch(`${API_URL}/mfa/verify-enable-initial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminId, token: totpCode, tempToken })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Código inválido');
      }

      return data;
    } catch (error) {
      console.error('Error al verificar y activar MFA inicial:', error);
      throw error;
    }
  },

  /**
   * Iniciar configuración de MFA - obtener QR y secreto
   */
  setupMFA: async (token) => {
    try {
      const response = await fetch(`${API_URL}/mfa/setup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al configurar MFA');
      }

      return data;
    } catch (error) {
      console.error('Error al configurar MFA:', error);
      throw error;
    }
  },

  /**
   * Verificar código TOTP y activar MFA
   */
  verifyAndEnable: async (token, totpCode) => {
    try {
      const response = await fetch(`${API_URL}/mfa/verify-enable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token: totpCode })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Código inválido');
      }

      return data;
    } catch (error) {
      console.error('Error al verificar y activar MFA:', error);
      throw error;
    }
  },

  /**
   * Verificar código TOTP durante login
   */
  verifyLoginCode: async (adminId, totpCode) => {
    try {
      const response = await fetch(`${API_URL}/admin/verify-mfa-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adminId,
          token: totpCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Código inválido');
      }

      return data;
    } catch (error) {
      console.error('Error al verificar código de login:', error);
      throw error;
    }
  },

  /**
   * Obtener estado de MFA
   */
  getMFAStatus: async (token) => {
    try {
      const response = await fetch(`${API_URL}/mfa/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener estado de MFA');
      }

      return data;
    } catch (error) {
      console.error('Error al obtener estado de MFA:', error);
      throw error;
    }
  },

  /**
   * Deshabilitar MFA
   */
  disableMFA: async (token, password) => {
    try {
      const response = await fetch(`${API_URL}/mfa/disable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al deshabilitar MFA');
      }

      return data;
    } catch (error) {
      console.error('Error al deshabilitar MFA:', error);
      throw error;
    }
  },

  /**
   * Regenerar códigos de respaldo
   */
  regenerateBackupCodes: async (token) => {
    try {
      const response = await fetch(`${API_URL}/mfa/regenerate-backup-codes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al regenerar códigos');
      }

      return data;
    } catch (error) {
      console.error('Error al regenerar códigos de respaldo:', error);
      throw error;
    }
  }
};

export default mfaService;
