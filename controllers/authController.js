const Usuario = require('../models/Usuarios')
const bcrypt = require('bcrypt')
// npm i jsonwebtoken
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
require('dotenv').config({path: 'variables.env'})

exports.autenticarUsuario = async (req, res, next) => {

	// Revisar si hay errores
	const errores = validationResult(req)
	if(!errores.isEmpty()) {
		return res.status(400).json({erroes: errores.array()})
	}
	// Buscar el usuario para saber si esta registrado
	const {email, password} = req.body
	const usuario = await Usuario.findOne({email})

	if(!usuario) {
		res.status(401).json({msg: 'El usuario no existe'})
		/* Si el codigo continua ejecutandose, poner return,
		no siemre es necesario */
		return next()
	}

	// Verificar el password y autenticar el usuario
	if(bcrypt.compareSync(password, usuario.password)) {
		// Crear JWT
		const token = jwt.sign({
			id: usuario._id,
			nombre: usuario.nombre,
			email: usuario.email
		}, process.env.SECRETA, { // Llave para firmar el token
			expiresIn: '8h'
		})
		// Respuesta
		res.json({token})
	} else {
		res.status(401).json({msg: "Password incorrecto"})
		return next()
	}
}

exports.usuarioAutenticado = (req, res, next) => {
	// Viene de la accion asignada desde el middleware
	res.json({usuario: req.usuario})
}