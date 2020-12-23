// npm i jsonwebtoken
const jwt = require('jsonwebtoken')
require('dotenv').config({path: 'variables.env'})

module.exports = (req, res, next) => {
	const authHeader = req.get('Authorization')

	// Si hay un authHeader
	if(authHeader){
		// Obtener token
		const token = authHeader.split(' ')[1] // Separar por 1 espacio y atraer la posición 1

		// Comprobar JWT
		try {
			const usuario = jwt.verify(token, process.env.SECRETA)// Llave para firmar el token
			// Asignar usuario, de forma interna se comunica el middleware con el controlador
			req.usuario = usuario
		} catch (error) {
			console.log(error);
			console.log('JWT no válido');
		}
	}

	return next()
}