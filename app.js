const express = require('express');
const connectDB = require('./config/db.js');
const Product = require('./models/host.js');

const app = express();
app.use(express.json());

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

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    
});