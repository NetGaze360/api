const SwitchInfo = require('../models/switch.js');

exports.getAllSwitches = async(req, res) => {
    try {
        const switches = await SwitchInfo.find();
        res.json(switches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getSwitch = async(req, res) => {
    try {
        const switchInfo = await SwitchInfo.findById(req.params.id);
        res.json(switchInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createSwitch = async (req, res) => {
    const newSwitch = new SwitchInfo({
        ...req.body,
        createdBy: req.user.userId,  // Añadir el usuario que lo crea
        createdAt: new Date()        // Fecha explícita
    });

    try {
        const sw = await newSwitch.save();
        res.json(sw);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateSwitch = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = {
            ...req.body,
            updatedBy: req.user.userId,  // Usuario que realiza la actualización
            updatedAt: new Date()        // Fecha de actualización
        };
        
        const switchInfo = await SwitchInfo.findByIdAndUpdate(id, updatedData, { new: true });
        
        if (!switchInfo) {
            return res.status(404).json({ msg: 'Switch not found' });
        }

        res.json(switchInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteSwitch = async (req, res) => {
    try {
        const switchInfo = await SwitchInfo.findByIdAndDelete(req.params.id);
        
        if (!switchInfo) {
            return res.status(404).json({ msg: 'Switch not found' });
        }

        res.json({ msg: 'Switch removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};