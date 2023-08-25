const mongoose = require('mongoose');

const switchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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

const Switch = mongoose.model('Switch', switchSchema);

module.exports = Switch;
