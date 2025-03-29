const mongoose = require('mongoose');

const connSchema = new mongoose.Schema({
    switch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Switch', // Referencia al modelo de Switch
        required: true,
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Host', // Referencia al modelo de Host
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
    // Campos de auditoría
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date
    }
}, { timestamps: false });

const ConnInfo = mongoose.model('Conn', connSchema, 'conns');

module.exports = ConnInfo;