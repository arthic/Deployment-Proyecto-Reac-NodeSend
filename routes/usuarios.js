const express = require('express')
const router = express.Router()
// npm i express-validator
const {check} = require('express-validator')
const usuarioController = require('../controllers/usuarioController')

router.post('/',
	// npm i express-validator
	[
		check('nombre', 'El Nombre es Obligatorio').not().isEmpty(), //NO este vacio
		check('email', 'Agrega un email válido').isEmail(),
		check('password', 'El password debe ser de almenos 6 caracteres').isLength({min: 6})
	],
	usuarioController.nuevoUsuario
)

module.exports = router