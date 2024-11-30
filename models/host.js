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
});

const Host = mongoose.model('Host', hostSchema, 'hosts');

module.exports = Host;
