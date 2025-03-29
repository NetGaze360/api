const Host = require('../models/host.js');
const ConnInfo = require('../models/conn.js');

exports.getAllHosts = async(req, res) => {
    try {
        console.log("Get all hosts");
        // Si el parámetro search existe en la query, usarlo para filtrar
        const searchQuery = req.query.search;
        // Opcionalmente incluir elementos eliminados
        const showDeleted = req.query.showDeleted === 'true';
        
        let filter = { isDeleted: false }; // Por defecto, sólo mostrar no eliminados
        
        if (showDeleted) {
            // Si se solicitan eliminados, no filtrar por isDeleted
            filter = {};
        }
        
        if (searchQuery) {
            // Añadir criterios de búsqueda
            filter.$or = [
                { hostname: new RegExp(searchQuery, 'i') },
                { ip: new RegExp(searchQuery, 'i') },
                { description: new RegExp(searchQuery, 'i') },
                { brand: new RegExp(searchQuery, 'i') }
            ];
        }

        const hosts = await Host.find(filter);
        console.log(hosts);
        res.json(hosts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createHost = async (req, res) => {
    const newHost = new Host({
        ...req.body,
        createdBy: req.user.userId,  // Añadir el usuario que lo crea
        createdAt: new Date()        // Fecha explícita
    });

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
        const updatedData = {
            ...req.body,
            updatedBy: req.user.userId,  // Usuario que realiza la actualización
            updatedAt: new Date()        // Fecha de actualización
        };
        
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

exports.deleteHost = async (req, res) => {
    try {
        console.log("Delete " + req.params.id);
        
        // Encontrar el host sin filtrar por isDeleted para asegurar que existe
        const host = await Host.findById(req.params.id);
        
        if (!host) {
            return res.status(404).json({ msg: 'Host not found' });
        }
        
        // Marcar conexiones asociadas como eliminadas
        await ConnInfo.updateMany(
            { host: req.params.id },
            { 
                isDeleted: true,
                deletedBy: req.user.userId,
                deletedAt: new Date()
            }
        );
        
        // Marcar el host como eliminado en lugar de eliminarlo físicamente
        await Host.findByIdAndUpdate(
            req.params.id,
            {
                isDeleted: true,
                deletedBy: req.user.userId,
                deletedAt: new Date()
            }
        );
        
        res.json({ 
            msg: 'Host marked as deleted',
            connectionsMarkedAsDeleted: true 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Añadir un método para restaurar hosts eliminados
exports.restoreHost = async (req, res) => {
    try {
        const host = await Host.findById(req.params.id);
        
        if (!host) {
            return res.status(404).json({ msg: 'Host not found' });
        }
        
        if (!host.isDeleted) {
            return res.status(400).json({ msg: 'Host is not deleted' });
        }
        
        // Restaurar el host
        await Host.findByIdAndUpdate(
            req.params.id,
            {
                isDeleted: false,
                $unset: { deletedBy: "", deletedAt: "" }
            }
        );
        
        // Opcionalmente restaurar conexiones asociadas
        await ConnInfo.updateMany(
            { host: req.params.id, isDeleted: true },
            {
                isDeleted: false,
                $unset: { deletedBy: "", deletedAt: "" }
            }
        );
        
        res.json({ 
            msg: 'Host restored successfully',
            connectionsRestored: true 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};