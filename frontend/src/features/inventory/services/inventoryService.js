const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const inventoryService = {
    /**
     * Obtiene el inventario de un usuario
     */
    async getInventory(userId) {
        const token = localStorage.getItem('supabase.auth.token'); // O como se guarde el token

        const response = await fetch(`${API_URL}/inventory/${userId}`, {
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            }
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data.data;
    },

    /**
     * Sincroniza el inventario con Steam
     */
    async syncInventory(steamItems) {
        const token = localStorage.getItem('supabase.auth.token');

        const response = await fetch(`${API_URL}/inventory/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ steamItems })
        });

        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        return data;
    }
};
