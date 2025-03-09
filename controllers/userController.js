const User = require('../models/user');

// Obtener todos los usuarios (solo accesible para admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -refreshToken');
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener un usuario por ID (admin o el propio usuario)
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Solo admin o el propio usuario pueden ver los detalles
        if (req.user.role !== 'admin' && req.user.userId !== userId) {
            return res.status(403).json({ 
                message: 'No tienes permiso para ver este usuario' 
            });
        }
        
        const user = await User.findById(userId).select('-password -refreshToken');
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Cambiar rol de usuario (solo admin)
exports.updateUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;
        
        // Validar que el rol sea válido
        if (!['admin', 'user', 'readonly'].includes(newRole)) {
            return res.status(400).json({ message: 'Rol no válido' });
        }
        
        // Evitar que un admin se degrade a sí mismo por accidente
        if (userId === req.user.userId && newRole !== 'admin') {
            return res.status(400).json({ 
                message: 'No puedes cambiar tu propio rol de administrador' 
            });
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role: newRole },
            { new: true, runValidators: true }
        ).select('-password -refreshToken');
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        res.json({
            message: `Rol de usuario actualizado a ${newRole}`,
            user: updatedUser
        });
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar perfil de usuario (admin o el propio usuario)
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Solo admin o el propio usuario pueden actualizar
        if (req.user.role !== 'admin' && req.user.userId !== userId) {
            return res.status(403).json({ 
                message: 'No tienes permiso para actualizar este usuario' 
            });
        }
        
        // Evitar que usuarios normales actualicen su rol
        if (req.user.role !== 'admin' && req.body.role) {
            delete req.body.role;
        }
        
        // Nunca actualizar password por esta ruta
        if (req.body.password) {
            delete req.body.password;
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            req.body,
            { new: true, runValidators: true }
        ).select('-password -refreshToken');
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        res.json(updatedUser);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar usuario (solo admin)
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Evitar que un admin se elimine a sí mismo
        if (userId === req.user.userId) {
            return res.status(400).json({ 
                message: 'No puedes eliminar tu propia cuenta de administrador' 
            });
        }
        
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};