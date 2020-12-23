const Usuario = require('../models/Usuarios')
// npm i express-validator
const {validationResult} = require('express-validator')
// npm i bcrypt
const bcrypt = require('bcrypt')

exports.nuevoUsuario = async (req,res) => {

	// Mostrar mensajes de error de express-validator
	const errores = validationResult(req)
	// Si no hay errores
	if(!errores.isEmpty()) {
		return res.status(400).json({errores: errores.array()})
	}

	// Vericiar si el usuario ya esta registrado
	const {email, password} = req.body
	let usuario = await Usuario.findOne({email})

	if(usuario) {
		return res.status(400).json({msg: 'El usuario ya esta registrado'})
	}

	// Crear nuevo usuario
	usuario = new Usuario(req.body)
	// Hashear el password
	const salt = await bcrypt.genSalt(10) //Numero de vualtas al hash
	usuario.password = await bcrypt.hash(password, salt)

	try {
		// Guardar en la BD
		await usuario.save()
		res.json({msg: 'Usuario creado correctamente'})

	} catch (error) {
		console.log(error);
	}
}