const express = require('express');
const router = express.Router();
const connController = require('../controllers/connController');

router.get('/', connController.getAllConns);
router.get('/:id', connController.getConns);
router.post('/', connController.createConn);
router.put('/:id', connController.updateConn);
router.delete('/:id', connController.deleteConn);

module.exports = router;