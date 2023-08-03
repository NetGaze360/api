const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema({
    hostname: {
        type: stringify,
        required: true
    },
    ip: {
        type: stringify,
        required: false
    },
    description: {
        type: stringify,
        required: false
    },
    brand: {
        type: stringify,
        required: false
    },

});

const Host = mongoose.model('Host', hostSchema);

module.exports = Host;
