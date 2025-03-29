const Host = require('../models/host');
const SwitchInfo = require('../models/switch');
const ConnInfo = require('../models/conn');
const SystemConfig = require('../models/systemConfig');

async function getRetentionDays() {
    const config = await SystemConfig.findOne({ key: 'deletionRetentionDays' });
    return config ? config.value : 30; // 30 días por defecto si no hay configuración
}

async function permanentlyDeleteOldRecords() {
    try {
        const retentionDays = await getRetentionDays();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
        
        console.log(`Executing permanent deletion for records marked as deleted before ${cutoffDate}`);
        
        // Eliminar hosts
        const hostsResult = await Host.deleteMany({
            isDeleted: true,
            deletedAt: { $lt: cutoffDate }
        });
        
        // Eliminar switches
        const switchesResult = await SwitchInfo.deleteMany({
            isDeleted: true,
            deletedAt: { $lt: cutoffDate }
        });
        
        // Eliminar conexiones
        const connsResult = await ConnInfo.deleteMany({
            isDeleted: true,
            deletedAt: { $lt: cutoffDate }
        });
        
        console.log(`Permanent deletion results:
            - Hosts: ${hostsResult.deletedCount} deleted
            - Switches: ${switchesResult.deletedCount} deleted
            - Connections: ${connsResult.deletedCount} deleted
        `);
        
        return {
            hosts: hostsResult.deletedCount,
            switches: switchesResult.deletedCount,
            connections: connsResult.deletedCount
        };
    } catch (error) {
        console.error('Error during permanent deletion:', error);
        throw error;
    }
}

module.exports = {
    permanentlyDeleteOldRecords
};