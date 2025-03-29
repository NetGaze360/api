const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const Host = require('../models/host');
const SwitchInfo = require('../models/switch');
const ConnInfo = require('../models/conn');
const User = require('../models/user');

// Obtener historial de acciones recientes
router.get('/', authenticateToken, async (req, res) => {
    try {
        // Limitar la cantidad de entradas para el rendimiento
        const limit = parseInt(req.query.limit) || 20;
        
        // Obtener hosts creados recientemente
        const hosts = await Host.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('createdBy', 'username')
            .select('hostname createdAt createdBy');
            
        // Obtener switches creados recientemente
        const switches = await SwitchInfo.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('createdBy', 'username')
            .select('name createdAt createdBy');
            
        // Obtener conexiones creadas recientemente
        const connections = await ConnInfo.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('createdBy', 'username')
            .populate('host', 'hostname')
            .populate('switch', 'name')
            .select('host switch swPort createdAt createdBy');

        // Obtener hosts eliminados recientemente
        const deletedHosts = await Host.find({ isDeleted: true })
            .sort({ deletedAt: -1 })
            .limit(limit)
            .populate('deletedBy', 'username')
            .select('hostname deletedAt deletedBy');
        
        // Combinar resultados y ordenar por fecha
        const allActions = [
            ...switches.map(s => ({
                type: 'switch',
                entity: s._id,
                name: s.name,
                date: s.createdAt,
                user: s.createdBy?.username || 'Unknown',
                action: 'created'
            })),
            ...connections.map(c => ({
                type: 'connection',
                entity: c._id,
                name: `Connection from ${c.host?.hostname || 'Unknown Host'} to ${c.switch?.name || 'Unknown Switch'} port ${c.swPort}`,
                date: c.createdAt,
                user: c.createdBy?.username || 'Unknown',
                action: 'created'
            })),
            ...hosts.map(h => {
                // Si tiene fecha de restauración (podemos añadirla al esquema)
                if (h.restoredAt) {
                    return {
                        type: 'host',
                        entity: h._id,
                        name: h.hostname,
                        date: h.restoredAt,
                        user: h.restoredBy?.username || 'Unknown',
                        action: 'restored'
                    };
                }
                
                return {
                    type: 'host',
                    entity: h._id,
                    name: h.hostname,
                    date: h.createdAt,
                    user: h.createdBy?.username || 'Unknown',
                    action: 'created'
                };
            }),
            // Si tiene fecha de eliminación (podemos añadirla al esquema)
            ...deletedHosts.map(h => ({
                type: 'host',
                entity: h._id,
                name: h.hostname,
                date: h.deletedAt,
                user: h.deletedBy?.username || 'Unknown',
                action: 'deleted'
            }))
        ];
        
        // Ordenar por fecha más reciente primero
        allActions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Limitar al número solicitado
        const limitedActions = allActions.slice(0, limit);

        console.log(limitedActions);
        
        res.json(limitedActions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;