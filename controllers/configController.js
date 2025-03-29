const SystemConfig = require('../models/systemConfig');

exports.getConfig = async (req, res) => {
    try {
        const { key } = req.params;
        
        const config = await SystemConfig.findOne({ key });
        
        if (!config) {
            return res.status(404).json({ msg: 'Configuration not found' });
        }
        
        res.json(config);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllConfigs = async (req, res) => {
    try {
        const configs = await SystemConfig.find();
        res.json(configs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateConfig = async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        
        if (value === undefined) {
            return res.status(400).json({ msg: 'Value is required' });
        }
        
        const config = await SystemConfig.findOneAndUpdate(
            { key },
            { 
                value,
                updatedBy: req.user.userId,
                updatedAt: new Date()
            },
            { new: true }
        );
        
        if (!config) {
            return res.status(404).json({ msg: 'Configuration not found' });
        }
        
        res.json(config);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};