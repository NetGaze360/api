const mongoose = require('mongoose');
const ConnInfo = require('../models/conn.js');

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

switchSchema.pre('findOneAndDelete', async function(next) {
    const switchId = this.getQuery()['_id'];
    
    try {
      // Delete all connections associated with this switch
      await ConnInfo.deleteMany({ 
        $or: [
          { switch: switchId },
        ]
      });
      next();
    } catch (err) {
      next(err);
    }
  });

const SwitchInfo = mongoose.model('Switch', switchSchema, 'switches');

module.exports = SwitchInfo;
