const mongoose = require('mongoose');

const systemConfigSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    description: String,
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const SystemConfig = mongoose.model('SystemConfig', systemConfigSchema);

// Inicializar configuraciones predeterminadas
async function initializeDefaultConfigs() {
    const defaults = [
        {
            key: 'deletionRetentionDays',
            value: 30, // 30 días por defecto
            description: 'Número de días que los elementos eliminados se conservan antes de ser borrados permanentemente'
        }
    ];

    for (const config of defaults) {
        await SystemConfig.findOneAndUpdate(
            { key: config.key },
            { $setOnInsert: config },
            { upsert: true, new: true }
        );
    }
}

// Ejecutar inicialización
initializeDefaultConfigs().catch(console.error);

module.exports = SystemConfig;