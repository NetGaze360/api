const Host = require('../models/host.js');

exports.getAllHosts = async(req, res) => {
    try {
        const hosts = await Host.find();
        res.json(hosts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createHost = async (req, res) => {
    const newHost = new Host(req.body);

    try {
        const host = await newHost.save();
        res.json(host);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateHost = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        
        const host = await Host.findByIdAndUpdate(id, updatedData, { new: true });
        
        if (!host) {
            return res.status(404).json({ msg: 'Host not found' });
        }

        res.json(host);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteHost = async (req, res) => {
    try {
        const host = await Host.findById(req.params.id);
        await Host.deleteOne(host);
        res.json({ msg: 'Host removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};