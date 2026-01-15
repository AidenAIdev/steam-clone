const API_URL = 'http://localhost:3000/api/admin';

const getHeaders = () => {
  const token = localStorage.getItem('adminToken');
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

const adminAuthService = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }
    
    if (data.token) {
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Logout de administrador
  logout: async () => {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: getHeaders()
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error al cerrar sesión:', data.message);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
  },

  // Administración de sesiones actuales
  getCurrentUser: () => {
    const userStr = localStorage.getItem('adminUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },

  validateSession: async () => {
    const response = await fetch(`${API_URL}/validate-session`, {
      method: 'GET',
      headers: getHeaders()
    });

    const data = await response.json();
    
    if (!response.ok) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      throw new Error(data.message || 'Sesión inválida');
    }
    
    return data;
  },
};

export default adminAuthService;
