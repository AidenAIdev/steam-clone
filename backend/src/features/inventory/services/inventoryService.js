import supabase from '../../../shared/config/supabase.js';

export const inventoryService = {
    /**
     * Valida si un usuario puede ver el inventario de otro (DAC Engine)
     * @param {string} viewerId - ID del usuario que intenta ver
     * @param {string} ownerId - ID del dueño del inventario
     * @returns {Promise<boolean>}
     */
    async canViewInventory(viewerId, ownerId) {
        if (viewerId === ownerId) return true;

        // Obtener la privacidad del perfil del dueño
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('inventory_privacy')
            .eq('id', ownerId)
            .single();

        if (profileError || !profile) return false;

        const privacy = profile.inventory_privacy;

        if (privacy === 'Public') return true;
        if (privacy === 'Private') return false;

        if (privacy === 'Friends') {
            if (!viewerId) return false;

            // Verificar si son amigos en la tabla friendships
            const { data: friendship, error: friendshipError } = await supabase
                .from('friendships')
                .select('status')
                .or(`and(user_id1.eq.${viewerId},user_id2.eq.${ownerId}),and(user_id1.eq.${ownerId},user_id2.eq.${viewerId})`)
                .eq('status', 'accepted')
                .single();

            return !!friendship;
        }

        return false;
    },

    /**
     * Obtiene el inventario de un usuario si el visor tiene permiso
     * @param {string} viewerId 
     * @param {string} ownerId 
     */
    async getUserInventory(viewerId, ownerId) {
        const allowed = await this.canViewInventory(viewerId, ownerId);

        if (!allowed) {
            throw new Error('No tienes permiso para ver este inventario');
        }

        const { data, error } = await supabase
            .from('user_inventories')
            .select(`
        *,
        games (
          id,
          title,
          description,
          image_url
        )
      `)
            .eq('user_id', ownerId);

        if (error) throw error;
        return data;
    },

    /**
     * Sincroniza el inventario local con Steam (Simulación de API central)
     * @param {string} userId 
     * @param {Array} steamItems 
     */
    async syncWithSteam(userId, steamItems) {
        // Aquí iría la lógica para llamar a la API de Steam
        // Por ahora, actualizamos la tabla local user_inventories

        // 1. Obtener items actuales
        const { data: currentItems } = await supabase
            .from('user_inventories')
            .select('game_id')
            .eq('user_id', userId);

        const currentIds = currentItems?.map(item => item.game_id) || [];
        const steamIds = steamItems.map(item => item.id);

        // 2. Identificar nuevos items
        const newItems = steamItems.filter(item => !currentIds.includes(item.id));

        if (newItems.length > 0) {
            const { error } = await supabase
                .from('user_inventories')
                .insert(
                    newItems.map(item => ({
                        user_id: userId,
                        game_id: item.id,
                        acquired_at: new Date().toISOString()
                    }))
                );

            if (error) throw error;
        }

        return {
            success: true,
            syncedCount: newItems.length
        };
    }
};
