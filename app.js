const express = require('express');
const connectDB = require('./config/db.js');
const Host = require('./models/host.js');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors());

connectDB();

app.get('/hosts', async(req, res) => {
    try {
        const hosts = await Host.find();
        res.json(hosts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/hosts', async (req, res) => {
    const newHost = new Host(req.body);

    try {
        const host = await newHost.save();
        res.json(host);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.delete('/hosts/:id', async (req, res) => {
    try {
        const host = await Host.findById(req.params.id);
        await host.remove();
        res.json({ msg: 'Host removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

//test