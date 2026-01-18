import React from 'react';
import { usePricesFeature } from '../hooks/usePricesFeature';
import { GameSelector } from '../components/GameSelector';
import { PriceEditor } from '../components/PriceEditor';
import { AlertTriangle } from 'lucide-react'; // Para el banner ocre

export function PricesPage() {
  const {
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
  } = usePricesFeature();

  return (
    <div className="bg-[#1e2a38] rounded-lg border border-[#2a3f5f] p-6 mb-6">
      {/* Encabezado Principal */}
      <h1 className="text-[#66c0f4] text-xl font-semibold mb-6">
        Definición de Precios
      </h1>

      {/* Banner Informativo (RF-010 y Política de 30 días) */}
      <div className="bg-[#5c4417] border border-[#856421] px-4 py-2 rounded-sm mb-8 flex items-center gap-3">
        <AlertTriangle className="text-[#efbb10]" size={18} />
        <p className="text-sm text-[#cebc9d]">
          Solo puedes cambiar el precio de una aplicación cada 30 días. El precio debe estar entre $0 y $1,000 USD.
        </p>
      </div>

      {/* Contenedor de Configuración */}
      <div className="bg-[#2a475e]/40 border border-[#23262e] rounded-sm p-6 shadow-lg">
        <h2 className="text-[#66c0f4] text-lg font-semibold mb-6">Configurar Precio</h2>

        {/* Feedback de Operación */}
        {error && <div className="bg-red-900/40 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-900/40 border border-green-500 text-green-200 p-3 rounded mb-4 text-sm">{success}</div>}

        <div className="space-y-6">
          {/* Selector de Juego */}
          <div className="flex flex-col gap-2">
            <GameSelector
              apps={apps}
              selectedGameId={selectedGameId}
              onSelect={setSelectedGameId}
            />
          </div>

          {/* Tu Componente PriceEditor con los props necesarios */}
          <PriceEditor
            selectedGame={selectedGame}
            price={price}
            setPrice={setPrice}
            onSubmit={handleUpdatePrice}
            loading={loading}
            // Deshabilitado si el precio no cumple el rango C12 o no hay juego
            disabled={!selectedGame || Number(price) < 0 || Number(price) > 1000}
          />
        </div>
      </div>
    </div>
  );
}