const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Rutas protegidas solo para administradores
router.get('/', 
    authenticateToken, 
    authorizeRoles('admin'), 
    userController.getAllUsers
);

// Cambiar rol - solo admin
router.post('/role', 
    authenticateToken, 
    authorizeRoles('admin'), 
    userController.updateUserRole
);

// Eliminar usuario - solo admin
router.delete('/:id', 
    authenticateToken, 
    authorizeRoles('admin'), 
    userController.deleteUser
);

// Rutas accesibles por el propio usuario o un admin
router.get('/:id', 
    authenticateToken, 
    userController.getUserById
);

router.put('/:id', 
    authenticateToken, 
    userController.updateUser
);

module.exports = router;