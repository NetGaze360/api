const express = require('express');
const connectDB = require('./config/db.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { authenticateToken } = require('./middleware/authMiddleware');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true  // Necesario para cookies
}));

// Conectar a la base de datos
connectDB();

// Rutas públicas
app.use('/auth', require('./routes/authRoutes.js'));

// Rutas protegidas
app.use('/users', require('./routes/userRoutes.js'));
app.use('/hosts', authenticateToken, require('./routes/hostsRoutes.js'));
app.use('/switches', authenticateToken, require('./routes/switchesRoutes.js'));
app.use('/conns', authenticateToken, require('./routes/connRoutes.js'));

// Ruta de prueba para verificar el estado del servidor
app.get('/api/status', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto ${port}`);
});