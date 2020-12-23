const Enlaces = require('../models/Enlace')
// npm i shortid
const shortid = require('shortid')
const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')

exports.nuevoEnlace = async (req, res, next) => {

	// Revisar si hay errores
	const errores = validationResult(req)
	if(!errores.isEmpty()) {
		return res.status(400).json({erroes: errores.array()})
	}
	// Crear un objeto del Schema Enlace
	const {nombre_original, nombre} = req.body

	// Generar instancia del modelo Enlace
	const enlace = new Enlaces()
	// Generar instancia de los datos del modelo
	enlace.url = shortid.generate()
	enlace.nombre = nombre
	enlace.nombre_original = nombre_original

	// Si el usuario esta autenticado
	if(req.usuario) { // Viene del Middleware
		const {password, descargas} = req.body

		// Asignar a enlace el número de descargas
		if(descargas) { // Si pasaron el valor de descargas
			enlace.descargas = descargas //Mandar a la BD
		}

		// Assignar password para la descarga
		if(password) {
			const salt = await bcrypt.genSalt(10)
			// 1° password a guardar en la DB | 2° password que viene del req
			enlace.password = await bcrypt.hash(password, salt) //Mandar a la BD
		}

		// Asignar autor
		enlace.autor = req.usuario.id // Viene del Middleware
	}
	// Almacenar en la BD
	try {
		await enlace.save()
		res.json({msg: `${enlace.url}`})
		next()

	} catch (error) {
		console.log(error);
	}
}

// Obtener el listado de todos los enlaces
exports.todosEnlaces = async (req, res) => {

	try {
		// Selecionar solo el url y omitir el _id
		const enlaces = await Enlaces.find({}).select('url -_id')
		res.json(enlaces)
	} catch (error) {
		console.log(error);
	}
}

// Retornar si el enlace tiene password o no
exports.tienePassword = async (req, res, next) => {
	const {url} = req.params
	// Veriicar si existe el enlace
	const enlace = await Enlaces.findOne({url})

	if(!enlace) {
		res.status(404).json({msg: 'Ese Enlace no existe'})
		return next()
	}

	// Validar si el enlace tiene password
	if(enlace.password) {
		return res.json({archivo: enlace.nombre, password: true, enlace: enlace.url})
	}
	// Ir al siguiente middleware
	next()
}

// validar si Password es correcto
exports.verificarPassword = async(req, res, next) => {
	const {url} = req.params
	const {password} = req.body

	// Consultar por el enlace
	const enlace = await Enlaces.findOne({url})
	// Verificar el password
	if(bcrypt.compareSync(password, enlace.password)) {
		/* Permitir descarga
		Pasa al siguiente middleware que es:
		enlacesController.obtenerEnlace */
		next()
	} else {
		return res.status(401).json({msg: 'Password Incorrecto'})
	}
}

// Obtener el enlace
exports.obtenerEnlace = async(req, res, next) => {

	const {url} = req.params
	// Veriicar si existe el enlace
	const enlace = await Enlaces.findOne({url})

	if(!enlace) {
		res.status(404).json({msg: 'Ese Enlace no existe'})
		return next()
	}

	// Si el enlace existe
	res.json({archivo: enlace.nombre, password: false})

	// Para que no elimine mientras provamos la app
	// return

	next()
}