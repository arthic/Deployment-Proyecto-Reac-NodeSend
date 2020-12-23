const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
// npm i express-validator
const {check} = require('express-validator')
// Middleware
const auth = require('../middleware/auth')

router.post('/',
	[
		check('email', 'Agrega un email válido').isEmail(),
		check('password', 'El password no puede ir vacio').not().isEmpty()
	],
	authController.autenticarUsuario
)

router.get('/',
	// Middleware
	auth,
	authController.usuarioAutenticado
)

module.exports = router