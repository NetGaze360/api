const express = require('express');
const router = express.Router();
const hostController = require('../controllers/hostController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Rutas GET - Accesibles para todos los usuarios autenticados
router.get('/', authenticateToken, hostController.getAllHosts);

// Rutas POST - Solo para admin y user
router.post('/', 
    authenticateToken, 
    authorizeRoles('admin', 'user'), 
    hostController.createHost
);

// Ruta para importar múltiples hosts - Solo admin
router.post('/addHosts', 
    authenticateToken, 
    authorizeRoles('admin'), 
    hostController.addHosts
);

// Rutas PUT - Solo para admin y user
router.put('/:id', 
    authenticateToken, 
    authorizeRoles('admin', 'user'), 
    hostController.updateHost
);

// Rutas DELETE - Solo para admin
router.delete('/:id', 
    authenticateToken, 
    authorizeRoles('admin'), 
    hostController.deleteHost
);

module.exports = router;