const mongoose = require('mongoose')
const Schema = mongoose.Schema

const enlacesSchema = new Schema({
	url: {
		type: String,
		required: true
	},
	nombre: {
		type: String,
		required: true
	},
	nombre_original: {
		type: String,
		required: true
	},
	descargas: {
		type: Number,
		default: 1
	},
	autor: {
		type: mongoose.Schema.Types.ObjectId, // Referencia al id que gera el Schema
		ref: 'Usuarios', // Referencia al otro modelo de la BD
		default: null // Porque no todos los enlaces tandran usuario que los creo
	},
	password: {
		type: String,
		default: null
	},
	creado: {
		type: Date,
		default: Date.now()
	}
})

module.exports = mongoose.model('Enlaces', enlacesSchema)