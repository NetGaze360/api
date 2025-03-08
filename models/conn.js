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
        min: 1,
    },
    hostPort: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
    },
    });

const ConnInfo = mongoose.model('Conn', connSchema, 'conns');

module.exports = ConnInfo;
