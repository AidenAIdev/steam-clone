import React from 'react';
import { useInventory } from '../hooks/useInventory';

export const InventoryGrid = ({ userId }) => {
    const { inventory, loading, error } = useInventory(userId);

    if (loading) return <div className="text-white p-4">Cargando inventario...</div>;
    if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
    if (!inventory || inventory.length === 0) {
        return <div className="text-gray-400 p-4">Este inventario está vacío o es privado.</div>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            {inventory.map((item) => (
                <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors">
                    <img
                        src={item.games?.image_url || 'https://via.placeholder.com/150'}
                        alt={item.games?.title}
                        className="w-full h-32 object-cover"
                    />
                    <div className="p-2">
                        <h3 className="text-white text-sm font-medium truncate">{item.games?.title}</h3>
                        <p className="text-gray-400 text-xs">Adquirido: {new Date(item.acquired_at).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
