import { supabase } from '../../../shared/config/supabase';

export const updateGamePrice = async (req, res) => {
    const { appId, newPrice } = req.body;
    const userId = req.user.id; // Obtenido del JWT validado

    // 1. Validación de Rango (C11, C12)
    if (newPrice < 0 || newPrice > 1000) {
        return res.status(400).json({ error: "El precio debe estar entre $0 y $1000 USD" });
    }

    try {
        // 2. Obtener datos actuales para verificar propiedad y tiempo (C18)
        const { data: game, error } = await supabase
            .from('games')
            .select('owner_id, last_price_change, status')
            .eq('id', appId)
            .single();

        if (!game || game.owner_id !== userId) {
            return res.status(403).json({ error: "No tienes permiso sobre esta aplicación" });
        }

        // 3. Verificar estado 'Approved'
        if (game.status !== 'Approved') {
            return res.status(400).json({ error: "Solo se pueden editar precios de juegos aprobados" });
        }

        // 4. Validación de 30 días (Política ABAC 4)
        const lastUpdate = new Date(game.last_price_change);
        const daysSinceLastUpdate = (new Date() - lastUpdate) / (1000 * 60 * 60 * 24);

        if (daysSinceLastUpdate < 30) {
            return res.status(403).json({ error: "Debes esperar 30 días entre cambios de precio" });
        }

        // 5. Proceder con la actualización (C2)
        const { error: updateError } = await supabase
            .from('games')
            .update({ 
                price: newPrice, 
                last_price_change: new Date().toISOString() 
            })
            .eq('id', appId);

        if (updateError) throw updateError;

        res.json({ message: "Precio actualizado correctamente" });

    } catch (err) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


export const getDeveloperGames = async (req, res) => {
    const userId = req.user.id;

    try {
        const { data, error } = await supabase
            .from('games')
            .select('id, name, price, last_price_change, status')
            .eq('owner_id', userId)
            .eq('status', 'Approved');

        if (error) throw error;

        // Si no hay datos, enviamos el arreglo vacío
        if (!data || data.length === 0) {
            return res.status(200).json({ 
                games: [], 
                message: "No se encontraron aplicaciones aprobadas para este desarrollador." 
            });
        }

        const gamesList = data.map(game => ({
            id: game.id,
            name: game.name,
            currentPrice: game.price,
            lastUpdate: game.last_price_change,
            canUpdate: (new Date() - new Date(game.last_price_change)) / (1000 * 60 * 60 * 24) >= 30
        }));

        res.json({ games: gamesList });
    } catch (err) {
        res.status(500).json({ error: "Error al consultar la base de datos" });
    }
};
