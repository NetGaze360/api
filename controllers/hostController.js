const Host = require('../models/host.js');
const ConnInfo = require('../models/conn.js');

exports.getAllHosts = async(req, res) => {
    try {
        // Si el parámetro search existe en la query, usarlo para filtrar
        const searchQuery = req.query.search;

        let hosts;

        if (searchQuery) {
            // Buscar hosts cuyo campo 'hostname', 'ip', 'description' o 'brand' contenga el término de búsqueda.
            hosts = await Host.find({
                $or: [
                    { hostname: new RegExp(searchQuery, 'i') },
                    { ip: new RegExp(searchQuery, 'i') },
                    { description: new RegExp(searchQuery, 'i') },
                    { brand: new RegExp(searchQuery, 'i') }
                ]
            });
        } else {
            hosts = await Host.find();
        }

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

exports.addHosts = async (req, res) => {
  try {
    // Obtén el JSON array de la solicitud
    const hostsArray = req.body;

    // Valida que sea un array antes de continuar
    if (!Array.isArray(hostsArray)) {
      return res.status(400).json({ error: 'El cuerpo de la solicitud debe ser un array JSON.' });
    }

    // Itera sobre el array y guarda cada objeto host en la base de datos
    for (const hostData of hostsArray) {
      const newHost = new Host(hostData);
      await newHost.save();
    }

    res.status(201).json({ message: 'Hosts agregados con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
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
        console.log("Delete " + req.params.id);
        const host = await Host.findById(req.params.id);
        
        if (!host) {
            return res.status(404).json({ msg: 'Host not found' });
        }
        
        // Eliminar todas las conexiones asociadas a este host
        await ConnInfo.deleteMany({ host: req.params.id });
        
        // Eliminar el host
        await Host.deleteOne(host);
        
        res.json({ 
            msg: 'Host removed',
            connectionsRemoved: true 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};