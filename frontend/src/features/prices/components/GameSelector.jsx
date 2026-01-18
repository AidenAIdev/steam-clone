import React, { useState } from 'react';

// prices/components/GameSelector.jsx
export function GameSelector({ apps, selectedGameId, onSelect }) {
  return (
    <div className="mb-4">
      <label className="block text-white mb-2">Selecciona Aplicación</label>
      <select
        className="w-full bg-slate-900 border border-slate-600 p-2 rounded text-white"
        value={selectedGameId || ''}
        onChange={e => onSelect(e.target.value)}
      >
        <option value="">Selecciona un juego aprobado...</option>
        {apps.map(app => {
          const ultimaActualizacion = new Date(app.updated_at);
          const diasTranscurridos = Math.floor((Date.now() - ultimaActualizacion) / (1000 * 60 * 60 * 24));
          const bloqueado = diasTranscurridos < 30;

          return (
            <option key={app.id} value={app.id} disabled={bloqueado} className={bloqueado ? 'text-gray-500' : 'text-white'}>
              {app.nombre_juego} {bloqueado ? `(Bloqueado: faltan ${30 - diasTranscurridos} días)` : ''}
            </option>
          );
        })}
      </select>
    </div>
  );
}
