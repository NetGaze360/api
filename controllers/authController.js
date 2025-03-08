const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Configuración de entorno
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your_access_token_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutos
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 días

// Registro de usuario
exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Comprobar si el usuario o email ya existen
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: 'El nombre de usuario o email ya están en uso' 
            });
        }

        // Crear nuevo usuario
        const user = new User({
            username,
            email,
            password,
            role: role || 'user' // Por defecto es 'user' si no se especifica
        });

        await user.save();

        res.status(201).json({ 
            message: 'Usuario registrado correctamente',
            userId: user._id
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar usuario
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isValid = await user.isValidPassword(password);
        if (!isValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Guardar refresh token en DB
        user.refreshToken = refreshToken;
        await user.save();

        // Enviar tokens
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
        });

        res.json({
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Refrescar token
exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({ message: 'No hay token de refresco' });
        }

        // Verificar token
        let userData;
        try {
            userData = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        } catch (error) {
            return res.status(403).json({ message: 'Token inválido o expirado' });
        }

        // Encontrar usuario y verificar que el token coincida
        const user = await User.findById(userData.userId);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Token no válido' });
        }

        // Generar nuevo access token
        const accessToken = generateAccessToken(user);
        
        res.json({ accessToken });
    } catch (error) {
        console.error('Error en refresh token:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (refreshToken) {
            // Encontrar usuario por refresh token y limpiarlo
            await User.findOneAndUpdate(
                { refreshToken },
                { refreshToken: null }
            );
        }
        
        // Limpiar cookie
        res.clearCookie('refreshToken');
        
        res.json({ message: 'Sesión cerrada correctamente' });
    } catch (error) {
        console.error('Error en logout:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Función para generar access token
function generateAccessToken(user) {
    return jwt.sign(
        { 
            userId: user._id,
            username: user.username,
            role: user.role
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
}

// Función para generar refresh token
function generateRefreshToken(user) {
    return jwt.sign(
        { userId: user._id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
}