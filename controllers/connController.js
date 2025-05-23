const Host = require('../models/host.js');
const SwitchInfo = require('../models/switch.js');
const ConnInfo = require('../models/conn.js');

exports.getAllConns = async(req, res) => {
    try {
        const conns = await ConnInfo.find();
        res.json(conns);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Función para obtener las conexiones de un switch en dos arrays, uno para las
// conexiones parells y un otro para las senars
exports.getConns = async(req, res) => {
    try {
        console.log(req.params.id);
        const conns = await ConnInfo.find({switch: req.params.id});
        
        console.log(conns);

        const connInfo = []; 
        // Arrays per les connexions parells i senars
        const evenConns = [];
        const oddConns = [];

        const switchInfo = await SwitchInfo.findById(req.params.id);
        console.log(switchInfo);
        console.log(switchInfo.nports);

        // Recorrem tots els ports del switch i mirem si hi ha connexió
        for(let i = 1; i <= switchInfo.nports; i++) {
            let connData = {};
            connData = {
                hostname: '',
                ip: '',
                swPort: i,
                hostPort: '',
            };
            for(let j = 0; j < conns.length; j++) {
                const conn = conns[j];
                // Si hi ha connexió, afegim la informació del host
                if(conn.swPort == i) {
                    // Obtenim la informació del host a partir dels seus IDs
                    const host = await Host.findById(conn.host);
                    connData = {
                        hostname: host.hostname,
                        ip: host.ip,
                        swPort: conn.swPort,
                        hostPort: conn.hostPort,
                    };
                }
            }
            // Afegim la connexió a l'array corresponent
            if(i % 2 == 0) {
                evenConns.push(connData);
            }
            else {
                oddConns.push(connData);
            }
        }
        // Afegim els arrays al JSON
        connInfo.evenConns = evenConns;
        connInfo.oddConns = oddConns;

        console.log(connInfo);
        res.json({
            evenConns: evenConns, 
            oddConns: oddConns
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createConn = async (req, res) => {
    const newConn = new ConnInfo({
        ...req.body,
        createdBy: req.user.userId,  // Añadir el usuario que lo crea
        createdAt: new Date()        // Fecha explícita
    });

    try {
        const sw = await newConn.save();
        res.json(sw);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.updateConn = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = {
            ...req.body,
            updatedBy: req.user.userId,  // Usuario que realiza la actualización
            updatedAt: new Date()       // Fecha de actualización
        };
        
        const connInfo = await ConnInfo.findByIdAndUpdate(id, updatedData, { new: true });
        
        if (!connInfo) {
            return res.status(404).json({ msg: 'Connection not found' });
        }

        res.json(connInfo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteConn = async (req, res) => {
    try {
        const connInfo = await ConnInfo.findById(req.params.id);
        await ConnInfo.deleteOne(connInfo);
        res.json({ msg: 'Connection removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};