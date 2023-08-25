const express = require('express');
const router = express.Router();
const switchController = require('../controllers/switchController');

router.get('/', switchController.getAllSwitches);
router.post('/', switchController.createSwitch);

module.exports = router;