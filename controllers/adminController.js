const { permanentlyDeleteOldRecords } = require('../utils/cleanupUtil');

exports.runCleanup = async (req, res) => {
    try {
        const result = await permanentlyDeleteOldRecords();
        res.json({
            message: 'Cleanup task executed successfully',
            deletedCounts: result
        });
    } catch (error) {
        console.error('Error executing cleanup task:', error);
        res.status(500).json({ message: 'Error executing cleanup task' });
    }
};