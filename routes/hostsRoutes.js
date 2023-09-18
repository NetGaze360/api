const express = require('express');
const router = express.Router();
const hostController = require('../controllers/hostController');

router.get('/', hostController.getAllHosts);
router.post('/', hostController.createHost);
router.post('/addHosts', hostController.addHosts);
router.put('/:id', hostController.updateHost);
router.delete('/:id', hostController.deleteHost);

module.exports = router;