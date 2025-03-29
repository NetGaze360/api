const express = require('express');
const router = express.Router();
const switchController = require('../controllers/switchController.js');

router.get('/', switchController.getAllSwitches);
router.get('/:id', switchController.getSwitch);
router.post('/', switchController.createSwitch);
router.put('/:id', switchController.updateSwitch);
router.delete('/:id', switchController.deleteSwitch);

module.exports = router;