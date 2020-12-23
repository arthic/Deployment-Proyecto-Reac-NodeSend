const express = require('express')
const conectarDB = require('./config/db')
// npm i cors
const cors = require('cors')

// Crear servidor
const app = express()

// Conectar a la DB
conectarDB()

// Habilitar CORS
const opcionesCors = {
	// Para solo aceptar peticiones de nuestra API
	origin: process.env.FRONTEND_URL
}
app.use(cors(opcionesCors))

// Puerto de la app
const port = process.env.PORT || 4000

// Habilitar los valores del req body
app.use(express.json())

// Habilitar carpeta pública
app.use(express.static('uploads'))

// Rutas de la APP
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/enlaces', require('./routes/enlaces'))
app.use('/api/archivos', require('./routes/archivos'))

// Iniciar app
app.listen(port, '0.0.0.0', () => {
	console.log(`El servidor esta corriendo en el puerto ${port}`);
})