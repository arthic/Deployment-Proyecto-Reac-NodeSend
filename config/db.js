// npm i mongoose dotenv
const mongoose = require('mongoose')
require('dotenv').config({path: 'variables.env'})

const conectarDB = async () => {

	try {
		await mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		})
		console.log('DB Conectada!');
	} catch (error) {
		console.log('Hubo un error');
		console.log(error);
		process.exist(1) // Detiene el servidor
	}
}

module.exports = conectarDB