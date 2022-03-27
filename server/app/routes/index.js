const express = require("express");
const router = express.Router();
const { validate, check_secret_input, check_valid_hash } = require('../middlewares/Validators');
const SecretController = require('../controllers/SecretController');

router.post('/secret', validate(check_secret_input), SecretController.storeSecret)
router.get('/secret/:hash', validate(check_valid_hash), SecretController.getSecret)


module.exports = router;