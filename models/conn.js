const mongoose = require('mongoose');

const connSchema = new mongoose.Schema({
    switch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'switch', // Referencia al modelo de Switch
        required: true,
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'host', // Referencia al modelo de Host
        required: true,
    },
    swPort: {
        type: Number,
        required: true,
    },
    hostPort: {
        type: Number,
        required: true,
    },
      // Otros campos relevantes para la conexión
    });

const ConnInfo = mongoose.model('Conn', connSchema);

module.exports = ConnInfo;
