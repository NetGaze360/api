const mongoose = require('mongoose');

const switchSchema = new mongoose.Schema({
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
    nports: {
        type: Number,
        required: true
    },

});

const Switch = mongoose.model('Switch', hostSchema);

module.exports = Switch;
