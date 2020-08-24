const express = require('express');
const router = express.Router();
const login = require('../middleware/login');
const itensController = require('../controllers/itens-controller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', itensController.postItens);
router.get('/', itensController.getItens);

module.exports = router;