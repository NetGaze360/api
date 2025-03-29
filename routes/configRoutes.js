const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Obtener todas las configuraciones - solo admin
router.get('/', 
    authenticateToken, 
    authorizeRoles('admin'), 
    configController.getAllConfigs
);

// Obtener una configuración específica - solo admin
router.get('/:key', 
    authenticateToken, 
    authorizeRoles('admin'), 
    configController.getConfig
);

// Actualizar una configuración - solo admin
router.put('/:key', 
    authenticateToken, 
    authorizeRoles('admin'), 
    configController.updateConfig
);

module.exports = router;