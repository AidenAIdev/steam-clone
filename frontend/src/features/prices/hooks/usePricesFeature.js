import { useEffect, useState } from 'react';
import { MOCK_APPS } from '../services/pricingService';

export function usePricesFeature() {
  const [apps, setApps] = useState(MOCK_APPS);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  useEffect(() => {
    const game = apps.find(app => app.id === selectedGameId);
    setSelectedGame(game || null);
    setPrice(game ? game.precio_base_usd : '');
  }, [selectedGameId, apps]);

  const handleUpdatePrice = async (mfaCode) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setTimeout(() => {
      setSuccess('Precio actualizado correctamente (mock)');
      setLoading(false);
    }, 1000);
  };

  return {
    apps,
    selectedGameId,
    setSelectedGameId,
    selectedGame,
    price,
    setPrice,
    loading,
    error,
    success,
    handleUpdatePrice
  };
}
