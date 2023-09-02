const express = require('express');
const connectDB = require('./config/db.js');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use('/hosts', require('./routes/hostsRoutes.js'));
app.use('/switches', require('./routes/switchesRoutes.js'));

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

//test2