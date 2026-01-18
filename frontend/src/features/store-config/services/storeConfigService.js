/**
 * Servicio de Configuración de Tienda para Desarrolladores
 * Consume la API de aplicaciones del backend
 *
 * Endpoints base: /api/new-app/:appId/...
 *
 * Campos editables en aplicaciones_desarrolladores:
 * - descripcion_larga: texto para SEO y página completa
 * - etiquetas: array de tags para búsqueda
 * - precio_base_usd: precio del juego (0-1000)
 */

const API_URL = '/api/new-app';

export const storeConfigService = {
  /**
   * Actualizar descripción larga de la aplicación
   * @param {string} appId - ID de la aplicación
   * @param {string} descripcion - Nueva descripción larga
   */
  async actualizarDescripcion(appId, descripcion) {
    const response = await fetch(`${API_URL}/${appId}/descripcion`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ descripcion_larga: descripcion }),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.mensaje || 'Error al actualizar descripción');
    return data;
  },

  /**
   * Actualizar etiquetas de la aplicación
   * @param {string} appId - ID de la aplicación
   * @param {string[]} etiquetas - Array de etiquetas
   */
  async actualizarEtiquetas(appId, etiquetas) {
    const response = await fetch(`${API_URL}/${appId}/etiquetas`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ etiquetas }),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.mensaje || 'Error al actualizar etiquetas');
    return data;
  },

  /**
   * Actualizar precio base de la aplicación
   * @param {string} appId - ID de la aplicación
   * @param {number} precio - Precio en USD (0-1000)
   */
  async actualizarPrecio(appId, precio) {
    const response = await fetch(`${API_URL}/${appId}/precio`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ precio_base_usd: precio }),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.mensaje || 'Error al actualizar precio');
    return data;
  },

  /**
   * Obtener configuración completa de una aplicación
   * @param {string} appId - ID de la aplicación
   */
  async obtenerConfiguracion(appId) {
    const response = await fetch(`${API_URL}/${appId}`, {
      credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.mensaje || 'Error al obtener configuración');
    return data;
  },
};
