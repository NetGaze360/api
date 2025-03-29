const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Ruta protegida solo para administradores
router.get('/dashboard', 
    authenticateToken, 
    authorizeRoles('admin'), 
    (req, res) => {
        res.json({ 
            message: 'Panel de administración', 
            data: {
                // Datos exclusivos para administradores
                userCount: 120,
                systemStatus: 'healthy',
                lastBackup: '2025-03-07T15:30:00Z'
            }
        });
    }
);

// Ruta accesible para admins y usuarios normales, pero no readonly
router.post('/settings', 
    authenticateToken, 
    authorizeRoles('admin', 'user'), 
    (req, res) => {
        // Lógica para actualizar configuraciones
        res.json({ message: 'Configuraciones actualizadas' });
    }
);

// Ejemplo para modificar la estructura de permisos en las rutas existentes
router.get('/advanced-metrics', 
    authenticateToken, 
    authorizeRoles('admin'), 
    (req, res) => {
        res.json({ 
            message: 'Métricas avanzadas del sistema', 
            metrics: {
                // Datos exclusivos para admins
            }
        });
    }
);

// Ruta para ejecutar una tarea de limpieza
router.post('/run-cleanup',
    authenticateToken,
    authorizeRoles('admin'),
    adminController.runCleanup
);

module.exports = router;