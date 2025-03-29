const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema({
    hostname: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    brand: {
        type: String,
        required: false
    },
    eth_ports: {
        type: Number,
        default: 1,
        min: 1
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
    },
    // Campos de borrado lógico
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deletedAt: {
        type: Date
    }
}, { timestamps: false });

const Host = mongoose.model('Host', hostSchema, 'hosts');

module.exports = Host;
