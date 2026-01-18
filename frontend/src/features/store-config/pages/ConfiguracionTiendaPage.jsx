/**
 * Página de Configuración de Tienda
 * Permite a los desarrolladores editar la información de sus aplicaciones publicadas:
 * - Descripción larga (para SEO y página de tienda)
 * - Etiquetas/tags para categorización
 * - Publicar anuncios y eventos
 * - Responder reseñas de usuarios
 */

import { useState, useEffect } from 'react';
import { X, Save, Tag, FileText, AlertCircle, Megaphone, MessageSquare, Star, Send } from 'lucide-react';
import { storeConfigService } from '../services/storeConfigService';
import { developerAuthService } from '../../developer-auth/services/developerAuthService';

export const ConfiguracionTiendaPage = () => {
  // Estado para la aplicación seleccionada
  const [aplicaciones, setAplicaciones] = useState([]);
  const [appSeleccionada, setAppSeleccionada] = useState('');
  const [appData, setAppData] = useState(null);
  const [loadingApps, setLoadingApps] = useState(true);

  // Estado para descripción larga
  const [descripcionLarga, setDescripcionLarga] = useState('');
  const [loadingDescripcion, setLoadingDescripcion] = useState(false);

  // Estado para etiquetas
  const [etiquetas, setEtiquetas] = useState([]);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState('');
  const [loadingEtiquetas, setLoadingEtiquetas] = useState(false);

  // Estado para anuncios
  const [nuevoAnuncio, setNuevoAnuncio] = useState({ titulo: '', contenido: '', tipo: 'noticia' });

  // Estado para respuestas a reseñas
  const [respuestas, setRespuestas] = useState({});

  // Datos hardcodeados de reseñas pendientes
  const resenasPendientes = [
    {
      id: '1',
      usuario: 'GamerPro123',
      rating: 4,
      titulo: 'Muy buen juego pero...',
      comentario: 'Me encanta la jugabilidad y los gráficos, pero hay algunos bugs menores que deberían corregirse. El modo multijugador es excelente.',
      fecha: '2024-01-15',
      recomendado: true,
    },
    {
      id: '2',
      usuario: 'CriticalReviewer',
      rating: 2,
      titulo: 'Necesita mejoras',
      comentario: 'El juego tiene potencial pero el rendimiento es muy bajo en mi PC. Esperaba más optimización para el precio que tiene.',
      fecha: '2024-01-14',
      recomendado: false,
    },
    {
      id: '3',
      usuario: 'CasualPlayer99',
      rating: 5,
      titulo: 'Increíble experiencia',
      comentario: 'Uno de los mejores juegos que he jugado este año. La historia es cautivadora y la banda sonora es espectacular.',
      fecha: '2024-01-13',
      recomendado: true,
    },
  ];

  // Mensajes de feedback
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Cargar aplicaciones al montar
  useEffect(() => {
    cargarAplicaciones();
  }, []);

  // Cargar datos cuando cambia la aplicación seleccionada
  useEffect(() => {
    if (appSeleccionada) {
      cargarDatosAplicacion();
    }
  }, [appSeleccionada]);

  const mostrarMensaje = (mensaje, tipo) => {
    if (tipo === 'success') {
      setSuccessMessage(mensaje);
      setErrorMessage('');
    } else {
      setErrorMessage(mensaje);
      setSuccessMessage('');
    }
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 5000);
  };

  const cargarAplicaciones = async () => {
    try {
      setLoadingApps(true);
      const response = await developerAuthService.obtenerAplicaciones();
      const apps = response.data || [];
      setAplicaciones(apps);
      if (apps.length > 0) {
        setAppSeleccionada(apps[0].id);
      }
    } catch (error) {
      mostrarMensaje(error.message || 'Error al cargar aplicaciones', 'error');
    } finally {
      setLoadingApps(false);
    }
  };

  const cargarDatosAplicacion = async () => {
    if (!appSeleccionada) return;

    const appActual = aplicaciones.find(app => app.id === appSeleccionada);
    if (appActual) {
      setAppData(appActual);
      setDescripcionLarga(appActual.descripcion_larga || '');
      setEtiquetas(appActual.etiquetas || []);
    }
  };

  const handleGuardarDescripcion = async () => {
    if (!appSeleccionada) {
      mostrarMensaje('Selecciona una aplicación primero', 'error');
      return;
    }

    try {
      setLoadingDescripcion(true);
      await storeConfigService.actualizarDescripcion(appSeleccionada, descripcionLarga);
      mostrarMensaje('Descripción actualizada correctamente', 'success');
      // Actualizar datos locales
      setAplicaciones(apps => apps.map(app =>
        app.id === appSeleccionada
          ? { ...app, descripcion_larga: descripcionLarga }
          : app
      ));
    } catch (error) {
      mostrarMensaje(error.message || 'Error al guardar descripción', 'error');
    } finally {
      setLoadingDescripcion(false);
    }
  };

  const handleAgregarEtiqueta = async () => {
    const etiquetaLimpia = nuevaEtiqueta.trim().toLowerCase();

    if (!etiquetaLimpia) {
      mostrarMensaje('Ingresa una etiqueta', 'error');
      return;
    }

    if (etiquetas.includes(etiquetaLimpia)) {
      mostrarMensaje('Esta etiqueta ya existe', 'error');
      return;
    }

    if (etiquetas.length >= 10) {
      mostrarMensaje('Máximo 10 etiquetas permitidas', 'error');
      return;
    }

    try {
      setLoadingEtiquetas(true);
      const nuevasEtiquetas = [...etiquetas, etiquetaLimpia];
      await storeConfigService.actualizarEtiquetas(appSeleccionada, nuevasEtiquetas);
      setEtiquetas(nuevasEtiquetas);
      setNuevaEtiqueta('');
      mostrarMensaje('Etiqueta agregada correctamente', 'success');
      // Actualizar datos locales
      setAplicaciones(apps => apps.map(app =>
        app.id === appSeleccionada
          ? { ...app, etiquetas: nuevasEtiquetas }
          : app
      ));
    } catch (error) {
      mostrarMensaje(error.message || 'Error al agregar etiqueta', 'error');
    } finally {
      setLoadingEtiquetas(false);
    }
  };

  const handleEliminarEtiqueta = async (etiqueta) => {
    try {
      setLoadingEtiquetas(true);
      const nuevasEtiquetas = etiquetas.filter(e => e !== etiqueta);
      await storeConfigService.actualizarEtiquetas(appSeleccionada, nuevasEtiquetas);
      setEtiquetas(nuevasEtiquetas);
      mostrarMensaje('Etiqueta eliminada', 'success');
      // Actualizar datos locales
      setAplicaciones(apps => apps.map(app =>
        app.id === appSeleccionada
          ? { ...app, etiquetas: nuevasEtiquetas }
          : app
      ));
    } catch (error) {
      mostrarMensaje(error.message || 'Error al eliminar etiqueta', 'error');
    } finally {
      setLoadingEtiquetas(false);
    }
  };

  const handlePublicarAnuncio = () => {
    if (!nuevoAnuncio.titulo.trim() || !nuevoAnuncio.contenido.trim()) {
      mostrarMensaje('Completa el título y contenido del anuncio', 'error');
      return;
    }
    // Por ahora solo mostramos mensaje de éxito (hardcoded)
    mostrarMensaje('Anuncio publicado correctamente (demo)', 'success');
    setNuevoAnuncio({ titulo: '', contenido: '', tipo: 'noticia' });
  };

  const handleEnviarRespuesta = (resenaId) => {
    const respuesta = respuestas[resenaId];
    if (!respuesta?.trim()) {
      mostrarMensaje('Escribe una respuesta antes de enviar', 'error');
      return;
    }
    // Por ahora solo mostramos mensaje de éxito (hardcoded)
    mostrarMensaje('Respuesta enviada correctamente (demo)', 'success');
    setRespuestas(prev => ({ ...prev, [resenaId]: '' }));
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
          />
        ))}
      </div>
    );
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      borrador: { color: 'bg-gray-600', text: 'Borrador' },
      en_revision: { color: 'bg-yellow-600', text: 'En Revisión' },
      aprobado: { color: 'bg-blue-600', text: 'Aprobado' },
      rechazado: { color: 'bg-red-600', text: 'Rechazado' },
      publicado: { color: 'bg-green-600', text: 'Publicado' },
    };
    return estados[estado] || { color: 'bg-gray-600', text: estado };
  };

  if (loadingApps) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-400">Cargando aplicaciones...</div>
      </div>
    );
  }

  if (aplicaciones.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">
          Configuración de la Página de Tienda
        </h2>
        <div className="bg-[#1e2a38] border border-[#2a3f5f] rounded-lg p-8 text-center">
          <AlertCircle className="mx-auto mb-4 text-yellow-400" size={48} />
          <h3 className="text-xl font-semibold text-white mb-2">
            No tienes aplicaciones registradas
          </h3>
          <p className="text-gray-400">
            Crea una aplicación primero en la pestaña "Nueva Aplicación" para poder configurar tu tienda.
          </p>
        </div>
      </div>
    );
  }

  const estadoBadge = appData ? getEstadoBadge(appData.estado_revision) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">
        Configuración de la Página de Tienda
      </h2>

      {/* Mensajes de feedback */}
      {successMessage && (
        <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
          <p className="text-green-400 flex items-center">
            <span className="mr-2">✓</span>
            {successMessage}
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400 flex items-center">
            <span className="mr-2">✗</span>
            {errorMessage}
          </p>
        </div>
      )}

      {/* Sección 1: Selección de Aplicación */}
      <div className="bg-[#1e2a38] border border-[#2a3f5f] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="text-[#66c0f4]" size={20} />
          <h3 className="text-lg font-semibold text-white">
            1. Selección de Aplicación
          </h3>
        </div>
        <p className="text-gray-400 text-sm mb-6">
          Selecciona la aplicación que deseas configurar.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Aplicación a Configurar
            </label>
            <select
              value={appSeleccionada}
              onChange={(e) => setAppSeleccionada(e.target.value)}
              className="w-full bg-[#0f1923] text-white px-4 py-2 rounded border border-[#2a3f5f] focus:border-[#66c0f4] focus:outline-none"
            >
              {aplicaciones.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.nombre_juego} (AppID: {app.app_id})
                </option>
              ))}
            </select>
          </div>

          {/* Info de la app seleccionada */}
          {appData && (
            <div className="bg-[#0f1923] border border-[#2a3f5f] rounded p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 block">Estado</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs text-white ${estadoBadge.color}`}>
                    {estadoBadge.text}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Categoría</span>
                  <span className="text-white">{appData.categoria || 'Sin categoría'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Precio actual</span>
                  <span className="text-white">
                    {appData.precio_base_usd === 0 ? 'Gratis' : `$${appData.precio_base_usd} USD`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Etiquetas</span>
                  <span className="text-white">{etiquetas.length}/10</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sección 2: Descripción Detallada */}
      <div className="bg-[#1e2a38] border border-[#2a3f5f] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="text-[#66c0f4]" size={20} />
          <h3 className="text-lg font-semibold text-white">
            2. Descripción Detallada
          </h3>
        </div>
        <p className="text-gray-400 text-sm mb-6">
          Texto largo para SEO y la página completa del juego. Máximo 2000 caracteres.
        </p>

        <div>
          <textarea
            value={descripcionLarga}
            onChange={(e) => setDescripcionLarga(e.target.value)}
            maxLength={2000}
            rows={6}
            placeholder="Describe el juego en detalle: características, historia, modos de juego, requisitos especiales..."
            className="w-full bg-[#0f1923] text-white px-4 py-3 rounded border border-[#2a3f5f] focus:border-[#66c0f4] focus:outline-none resize-none"
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-gray-500">
              {descripcionLarga.length}/2000 caracteres
            </span>
            <button
              onClick={handleGuardarDescripcion}
              disabled={loadingDescripcion}
              className="flex items-center gap-2 px-4 py-2 bg-[#66c0f4] text-white rounded hover:bg-[#5bb1e3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {loadingDescripcion ? 'Guardando...' : 'Guardar Descripción'}
            </button>
          </div>
        </div>
      </div>

      {/* Sección 3: Etiquetas */}
      <div className="bg-[#1e2a38] border border-[#2a3f5f] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-1">
          <Tag className="text-[#66c0f4]" size={20} />
          <h3 className="text-lg font-semibold text-white">
            3. Etiquetas de Búsqueda
          </h3>
        </div>
        <p className="text-gray-400 text-sm mb-6">
          Agrega etiquetas para que los usuarios encuentren tu juego más fácilmente. Máximo 10 etiquetas.
        </p>

        {/* Etiquetas actuales */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-3">
            Etiquetas actuales
          </label>
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {etiquetas.length > 0 ? (
              etiquetas.map((etiqueta, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#2a3f5f] text-white text-sm rounded-full border border-[#3d5a80]"
                >
                  {etiqueta}
                  <button
                    onClick={() => handleEliminarEtiqueta(etiqueta)}
                    disabled={loadingEtiquetas}
                    className="ml-1 hover:text-red-400 transition-colors disabled:opacity-50"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No hay etiquetas asignadas</span>
            )}
          </div>
        </div>

        {/* Agregar nueva etiqueta */}
        <div className="flex gap-2">
          <input
            type="text"
            value={nuevaEtiqueta}
            onChange={(e) => setNuevaEtiqueta(e.target.value)}
            placeholder="Ej: acción, aventura, multijugador..."
            onKeyDown={(e) => e.key === 'Enter' && handleAgregarEtiqueta()}
            maxLength={30}
            className="flex-1 bg-[#0f1923] text-white px-4 py-2 rounded border border-[#2a3f5f] focus:border-[#66c0f4] focus:outline-none"
          />
          <button
            onClick={handleAgregarEtiqueta}
            disabled={loadingEtiquetas || etiquetas.length >= 10}
            className="px-4 py-2 bg-[#66c0f4] text-white rounded hover:bg-[#5bb1e3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Agregar +
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Las etiquetas ayudan a los usuarios a descubrir tu juego en búsquedas y filtros.
        </p>
      </div>

      {/* Sección 4: Anuncios y Eventos */}
      <div className="bg-[#1e2a38] border border-[#2a3f5f] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-1">
          <Megaphone className="text-[#66c0f4]" size={20} />
          <h3 className="text-lg font-semibold text-white">
            4. Publicar Anuncio o Evento
          </h3>
        </div>
        <p className="text-gray-400 text-sm mb-6">
          Publica noticias, eventos, parches o actualizaciones para mantener informados a tus jugadores.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Tipo de Anuncio
            </label>
            <select
              value={nuevoAnuncio.tipo}
              onChange={(e) => setNuevoAnuncio(prev => ({ ...prev, tipo: e.target.value }))}
              className="w-full bg-[#0f1923] text-white px-4 py-2 rounded border border-[#2a3f5f] focus:border-[#66c0f4] focus:outline-none"
            >
              <option value="noticia">Noticia</option>
              <option value="evento">Evento</option>
              <option value="parche">Parche / Actualización</option>
              <option value="promocion">Promoción</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Título del Anuncio
            </label>
            <input
              type="text"
              value={nuevoAnuncio.titulo}
              onChange={(e) => setNuevoAnuncio(prev => ({ ...prev, titulo: e.target.value }))}
              placeholder="Ej: ¡Nueva actualización 2.0 disponible!"
              maxLength={255}
              className="w-full bg-[#0f1923] text-white px-4 py-2 rounded border border-[#2a3f5f] focus:border-[#66c0f4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Contenido
            </label>
            <textarea
              value={nuevoAnuncio.contenido}
              onChange={(e) => setNuevoAnuncio(prev => ({ ...prev, contenido: e.target.value }))}
              rows={4}
              placeholder="Describe los detalles del anuncio, evento o actualización..."
              className="w-full bg-[#0f1923] text-white px-4 py-3 rounded border border-[#2a3f5f] focus:border-[#66c0f4] focus:outline-none resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handlePublicarAnuncio}
              className="flex items-center gap-2 px-4 py-2 bg-[#66c0f4] text-white rounded hover:bg-[#5bb1e3] transition-colors font-medium"
            >
              <Megaphone size={16} />
              Publicar Anuncio
            </button>
          </div>
        </div>
      </div>

      {/* Sección 5: Reseñas Pendientes */}
      <div className="bg-[#1e2a38] border border-[#2a3f5f] rounded-lg p-6">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="text-[#66c0f4]" size={20} />
          <h3 className="text-lg font-semibold text-white">
            5. Reseñas Pendientes de Respuesta
          </h3>
        </div>
        <p className="text-gray-400 text-sm mb-6">
          Responde a las reseñas de tus usuarios para mejorar la comunicación con tu comunidad.
        </p>

        <div className="space-y-4">
          {resenasPendientes.map((resena) => (
            <div
              key={resena.id}
              className="bg-[#0f1923] border border-[#2a3f5f] rounded-lg p-4"
            >
              {/* Header de la reseña */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2a3f5f] rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {resena.usuario.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{resena.usuario}</p>
                    <div className="flex items-center gap-2">
                      {renderStars(resena.rating)}
                      <span className="text-xs text-gray-500">{resena.fecha}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    resena.recomendado
                      ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                      : 'bg-red-900/30 text-red-400 border border-red-500/30'
                  }`}
                >
                  {resena.recomendado ? 'Recomendado' : 'No recomendado'}
                </span>
              </div>

              {/* Contenido de la reseña */}
              <div className="mb-4">
                <h4 className="text-white font-medium mb-1">{resena.titulo}</h4>
                <p className="text-gray-400 text-sm">{resena.comentario}</p>
              </div>

              {/* Campo de respuesta */}
              <div className="border-t border-[#2a3f5f] pt-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Tu respuesta oficial:
                </label>
                <div className="flex gap-2">
                  <textarea
                    value={respuestas[resena.id] || ''}
                    onChange={(e) => setRespuestas(prev => ({ ...prev, [resena.id]: e.target.value }))}
                    rows={2}
                    placeholder="Escribe tu respuesta a esta reseña..."
                    className="flex-1 bg-[#1e2a38] text-white px-3 py-2 rounded border border-[#2a3f5f] focus:border-[#66c0f4] focus:outline-none resize-none text-sm"
                  />
                  <button
                    onClick={() => handleEnviarRespuesta(resena.id)}
                    className="self-end px-4 py-2 bg-[#66c0f4] text-white rounded hover:bg-[#5bb1e3] transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {resenasPendientes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay reseñas pendientes de respuesta
            </div>
          )}
        </div>
      </div>

      {/* Nota informativa */}
      <div className="bg-[#0f1923] border border-[#2a3f5f] rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-[#66c0f4] mt-0.5 flex-shrink-0" size={20} />
          <div className="text-sm text-gray-400">
            <p className="font-medium text-white mb-1">Nota importante</p>
            <p>
              Los cambios en la configuración de tu tienda se reflejarán inmediatamente
              en la página de tu juego. Asegúrate de revisar la información antes de guardar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
