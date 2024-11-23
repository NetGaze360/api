const mongoose = require('mongoose');

const switchSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    area_code: {
        type: Number,
        required: false
    },
    brand: {
        type: String,
        required: false
    },
    nports: {
        type: Number,
        required: true
    },
    nconnections: {
        type: Number,
        required: true
    },

});

const SwitchInfo = mongoose.model('Switch', switchSchema, 'switches');

module.exports = SwitchInfo;
