import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { supabaseAdmin } from '../../../shared/config/supabase.js';

const mfaService = {
  /**
   * Genera un secreto TOTP y un código QR para configurar MFA
   */
  generateMFASecret: async (adminId, email) => {
    try {
      // Generar secreto TOTP
      const secret = speakeasy.generateSecret({
        name: `Steam Admin (${email})`,
        issuer: 'Steam Clone Admin',
        length: 32
      });

      // Generar código QR
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

      // Guardar el secreto temporalmente (sin activar aún)
      const { error } = await supabaseAdmin
        .from('admins')
        .update({
          mfa_secret: secret.base32,
          mfa_habilitado: false, // No activar hasta verificar
          mfa_backup_codes: null
        })
        .eq('id', adminId);

      if (error) {
        console.error('Error al guardar secreto MFA:', error);
        throw new Error('Error al configurar MFA');
      }

      return {
        secret: secret.base32,
        qrCode: qrCodeUrl,
        manualEntryKey: secret.base32
      };
    } catch (error) {
      console.error('Error al generar secreto MFA:', error);
      throw error;
    }
  },

  /**
   * Verifica un código TOTP y activa MFA si es correcto
   */
  verifyAndEnableMFA: async (adminId, token) => {
    try {
      // Obtener el secreto del admin
      const { data: admin, error: adminError } = await supabaseAdmin
        .from('admins')
        .select('mfa_secret, mfa_habilitado')
        .eq('id', adminId)
        .single();

      if (adminError || !admin) {
        throw new Error('Administrador no encontrado');
      }

      if (!admin.mfa_secret) {
        throw new Error('No hay secreto MFA configurado');
      }

      // Verificar el token TOTP
      const verified = speakeasy.totp.verify({
        secret: admin.mfa_secret,
        encoding: 'base32',
        token: token,
        window: 2 // Permite 2 intervalos antes y después (60 segundos de margen)
      });

      if (!verified) {
        throw new Error('Código de verificación inválido');
      }

      // Generar códigos de respaldo
      const backupCodes = mfaService.generateBackupCodes();

      // Activar MFA
      const { error: updateError } = await supabaseAdmin
        .from('admins')
        .update({
          mfa_habilitado: true,
          mfa_backup_codes: JSON.stringify(backupCodes)
        })
        .eq('id', adminId);

      if (updateError) {
        console.error('Error al activar MFA:', updateError);
        throw new Error('Error al activar MFA');
      }

      return {
        success: true,
        backupCodes
      };
    } catch (error) {
      console.error('Error al verificar y activar MFA:', error);
      throw error;
    }
  },

  /**
   * Verifica un código TOTP para login
   */
  verifyTOTP: async (adminId, token) => {
    try {
      // Obtener el secreto del admin
      const { data: admin, error: adminError } = await supabaseAdmin
        .from('admins')
        .select('mfa_secret, mfa_habilitado, mfa_backup_codes')
        .eq('id', adminId)
        .single();

      if (adminError || !admin) {
        throw new Error('Administrador no encontrado');
      }

      if (!admin.mfa_habilitado || !admin.mfa_secret) {
        throw new Error('MFA no está habilitado');
      }

      // Verificar si es un código de respaldo
      if (admin.mfa_backup_codes) {
        const backupCodes = JSON.parse(admin.mfa_backup_codes);
        const codeIndex = backupCodes.findIndex(code => code === token);
        
        if (codeIndex !== -1) {
          // Código de respaldo válido, eliminarlo
          backupCodes.splice(codeIndex, 1);
          await supabaseAdmin
            .from('admins')
            .update({
              mfa_backup_codes: JSON.stringify(backupCodes)
            })
            .eq('id', adminId);
          
          return true;
        }
      }

      // Verificar el token TOTP
      const verified = speakeasy.totp.verify({
        secret: admin.mfa_secret,
        encoding: 'base32',
        token: token,
        window: 2
      });

      return verified;
    } catch (error) {
      console.error('Error al verificar TOTP:', error);
      throw error;
    }
  },

  /**
   * Deshabilita MFA para un admin
   */
  disableMFA: async (adminId) => {
    try {
      const { error } = await supabaseAdmin
        .from('admins')
        .update({
          mfa_secret: null,
          mfa_habilitado: false,
          mfa_backup_codes: null
        })
        .eq('id', adminId);

      if (error) {
        console.error('Error al deshabilitar MFA:', error);
        throw new Error('Error al deshabilitar MFA');
      }

      return { success: true };
    } catch (error) {
      console.error('Error al deshabilitar MFA:', error);
      throw error;
    }
  },

  /**
   * Verifica si un admin tiene MFA habilitado
   */
  checkMFAStatus: async (adminId) => {
    try {
      const { data: admin, error } = await supabaseAdmin
        .from('admins')
        .select('mfa_habilitado')
        .eq('id', adminId)
        .single();

      if (error) {
        throw new Error('Error al verificar estado de MFA');
      }

      return {
        mfaEnabled: admin?.mfa_habilitado || false
      };
    } catch (error) {
      console.error('Error al verificar estado de MFA:', error);
      throw error;
    }
  },

  /**
   * Genera códigos de respaldo
   */
  generateBackupCodes: () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      // Generar código de 8 dígitos
      const code = Math.floor(10000000 + Math.random() * 90000000).toString();
      codes.push(code);
    }
    return codes;
  },

  /**
   * Regenera códigos de respaldo
   */
  regenerateBackupCodes: async (adminId) => {
    try {
      const backupCodes = mfaService.generateBackupCodes();

      const { error } = await supabaseAdmin
        .from('admins')
        .update({
          mfa_backup_codes: JSON.stringify(backupCodes)
        })
        .eq('id', adminId);

      if (error) {
        throw new Error('Error al regenerar códigos de respaldo');
      }

      return backupCodes;
    } catch (error) {
      console.error('Error al regenerar códigos de respaldo:', error);
      throw error;
    }
  }
};

export default mfaService;
