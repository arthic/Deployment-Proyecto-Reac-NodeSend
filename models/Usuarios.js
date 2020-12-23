const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usuariosSchema = new Schema({
	email: {
		type: String,
		required: true, //Obligatorio
		unique: true, // Debe ser unico
		lowercase: true,
		trim : true //quitar espacios
	},
	nombre: {
		type: String,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
		trim: true
	}
})

module.exports = mongoose.model('Usuarios', usuariosSchema)