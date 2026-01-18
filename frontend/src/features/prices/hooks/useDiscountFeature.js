import { useEffect, useState, useCallback } from 'react';
import { fetchMyApps, updateAppDiscount } from '../services/pricingService';

export function useDiscountFeature() {
  const [apps, setApps] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [discount, setDiscount] = useState('');
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
    setDiscount(game ? (game.descuento || 0) : '');
    // Limpiar mensajes al cambiar de juego
    setError(null);
    setSuccess(null);
  }, [selectedGameId, apps]);

  const handleUpdateDiscount = async (mfaCode) => {
    if (!selectedGameId) {
      setError('Selecciona un juego');
      return;
    }

    const discountValue = Number(discount);
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 1) {
      setError('El descuento debe estar entre 0 y 1 (ej: 0.25 = 25%)');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateAppDiscount(selectedGameId, discountValue, mfaCode);
      setSuccess(result.mensaje || 'Descuento actualizado correctamente');
      
      // Actualizar el descuento en la lista local
      setApps(prevApps => 
        prevApps.map(app => 
          app.id === selectedGameId 
            ? { ...app, descuento: discountValue }
            : app
        )
      );
    } catch (err) {
      setError(err.message || 'Error al actualizar el descuento');
    } finally {
      setLoading(false);
    }
  };

  return {
    apps,
    selectedGameId,
    setSelectedGameId,
    selectedGame,
    discount,
    setDiscount,
    loading,
    loadingApps,
    error,
    success,
    handleUpdateDiscount,
    refreshApps: loadApps
  };
}
