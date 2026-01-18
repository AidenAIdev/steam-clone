import { useEffect, useState, useCallback } from 'react';
import { fetchMyApps, updateAppPrice } from '../services/pricingService';

export function usePricesFeature() {
  const [apps, setApps] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingApps, setLoadingApps] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Cargar aplicaciones del desarrollador al montar
  const loadApps = useCallback(async () => {
    try {
      setLoadingApps(true);
      setError(null);
      const appsData = await fetchMyApps();
      setApps(appsData);
    } catch (err) {
      setError(err.message || 'Error al cargar aplicaciones');
      setApps([]);
    } finally {
      setLoadingApps(false);
    }
  }, []);

  useEffect(() => {
    loadApps();
  }, [loadApps]);

  // Actualizar juego seleccionado cuando cambia la selección
  useEffect(() => {
    const game = apps.find(app => app.id === selectedGameId);
    setSelectedGame(game || null);
    setPrice(game ? game.precio_base_usd : '');
    // Limpiar mensajes al cambiar de juego
    setError(null);
    setSuccess(null);
  }, [selectedGameId, apps]);

  const handleUpdatePrice = async (mfaCode) => {
    if (!selectedGameId || !price) {
      setError('Selecciona un juego y un precio válido');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateAppPrice(selectedGameId, price, mfaCode);
      setSuccess(result.mensaje || 'Precio actualizado correctamente');
      
      // Actualizar el precio en la lista local
      setApps(prevApps => 
        prevApps.map(app => 
          app.id === selectedGameId 
            ? { ...app, precio_base_usd: Number(price), updated_at: new Date().toISOString() }
            : app
        )
      );
    } catch (err) {
      setError(err.message || 'Error al actualizar el precio');
    } finally {
      setLoading(false);
    }
  };

  return {
    apps,
    selectedGameId,
    setSelectedGameId,
    selectedGame,
    price,
    setPrice,
    loading,
    loadingApps,
    error,
    success,
    handleUpdatePrice,
    refreshApps: loadApps
  };
}
