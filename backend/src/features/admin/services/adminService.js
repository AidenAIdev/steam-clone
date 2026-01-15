import supabase, { supabaseAdmin } from '../../../shared/config/supabase.js';

const adminService = {
  /**
   * Login de administrador
   */
  login: async (email, password, ipAddress, userAgent) => {
    try {
      // Autenticar con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Error de autenticación:', authError);
        throw new Error('Credenciales inválidas');
      }

      const userId = authData.user.id;
      const accessToken = authData.session.access_token;
      const refreshToken = authData.session.refresh_token;

      // Verificar que el usuario es un administrador activo
      const { data: admin, error: adminError } = await supabaseAdmin
        .from('admins')
        .select('*')
        .eq('id', userId)
        .eq('cuenta_activa', true)
        .single();

      if (adminError || !admin) {
        // Cerrar sesión de Supabase si no es admin
        await supabase.auth.signOut();
        console.error('Error al consultar admin:', adminError);
        throw new Error('Acceso denegado: No eres un administrador activo');
      }

      // Crear registro de sesión en la base de datos para auditoría
      const { error: sessionError } = await supabaseAdmin
        .from('sesiones_admin')
        .insert({
          admin_id: userId,
          access_token: accessToken,
          ip_address: ipAddress,
          user_agent: userAgent,
          activa: true,
        });

      if (sessionError) {
        console.error('Error al crear registro de sesión:', sessionError);
        // No fallar, solo es para auditoría
      }

      // Registrar en audit log
      await adminService.registrarAuditLog(
        userId,
        'login',
        'sesion_admin',
        { email },
        ipAddress,
        userAgent,
        'exito'
      );

      return {
        token: accessToken,
        refreshToken,
        user: {
          id: userId,
          email: authData.user.email,
          rol: admin.rol,
          permisos: admin.permisos,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout de administrador
   */
  logout: async (token, adminId, ipAddress, userAgent) => {
    try {
      // Cerrar sesión en Supabase
      // Usamos supabaseAdmin para hacer signOut con el token específico
      const { error: signOutError } = await supabaseAdmin.auth.admin.signOut(token);
      
      if (signOutError) {
        console.error('Error al cerrar sesión en Supabase:', signOutError);
      }

      // Marcar sesión como inactiva en la base de datos
      await supabaseAdmin
        .from('sesiones_admin')
        .update({
          activa: false,
          fecha_cierre: new Date().toISOString(),
        })
        .eq('access_token', token)
        .eq('admin_id', adminId);

      // Registrar en audit log
      await adminService.registrarAuditLog(
        adminId,
        'logout',
        'sesion_admin',
        {},
        ipAddress,
        userAgent,
        'exito'
      );

      return { message: 'Sesión cerrada exitosamente' };
    } catch (error) {
      throw new Error('Error al cerrar sesión');
    }
  },

  /**
   * Validar sesión de administrador
   */
  validateSession: async (token) => {
    try {
      // Verificar token con Supabase Auth
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);

      if (userError || !user) {
        throw new Error('Token inválido o expirado');
      }

      // Verificar que el usuario sea un administrador activo
      const { data: admin, error: adminError } = await supabaseAdmin
        .from('admins')
        .select('*')
        .eq('id', user.id)
        .eq('cuenta_activa', true)
        .single();

      if (adminError || !admin) {
        throw new Error('Administrador no activo');
      }

      // Verificar que la sesión esté activa en la base de datos
      const { data: session } = await supabaseAdmin
        .from('sesiones_admin')
        .select('*')
        .eq('access_token', token)
        .eq('activa', true)
        .single();

      if (!session) {
        throw new Error('Sesión inválida o cerrada');
      }

      return {
        valid: true,
        admin: {
          id: user.id,
          email: user.email,
          rol: admin.rol,
          permisos: admin.permisos,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Registrar en audit log
   */
  registrarAuditLog: async (adminId, accion, recurso, detalles, ipAddress, userAgent, resultado) => {
    try {
      await supabaseAdmin.from('audit_logs_admin').insert({
        admin_id: adminId,
        accion,
        recurso,
        detalles,
        ip_address: ipAddress,
        user_agent: userAgent,
        resultado,
      });
    } catch (error) {
      console.error('Error al registrar audit log:', error);
    }
  },

  /**
   * Limpiar sesiones expiradas
   */
  limpiarSesionesExpiradas: async () => {
    try {
      const { error } = await supabaseAdmin.rpc('limpiar_sesiones_admin_expiradas');
      
      if (error) {
        console.error('Error al limpiar sesiones:', error);
      }
    } catch (error) {
      console.error('Error al limpiar sesiones expiradas:', error);
    }
  },
};

export default adminService;
