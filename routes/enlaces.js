const express = require('express')
const router = express.Router()
const enlacesController = require('../controllers/enlacesController')
const archivosController = require('../controllers/archivosController')
// npm i express-validator
const {check} = require('express-validator')
// Middleware
const auth = require('../middleware/auth')

router.post('/',
	// Validar
	check('nombre', 'Sube un archivo').not().isEmpty(),
	check('nombre_original', 'Sube un archivo').not().isEmpty(),
	// Middleware
	auth,
	enlacesController.nuevoEnlace
)

router.get('/',
	enlacesController.todosEnlaces
)
// url reacciona a cualquier url es un comodin dinamico
router.get('/:url',
	enlacesController.tienePassword,
	enlacesController.obtenerEnlace
)

router.post('/:url',
	enlacesController.verificarPassword,
	enlacesController.obtenerEnlace
)

module.exports = router