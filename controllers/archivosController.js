const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')
const Enlaces = require('../models/Enlace')

exports.subirArchivo = async (req, res, next) => {
	const configuracionMulter = {
		limits : {fileSize : req.usuario ? 1024 * 1024 * 10 : 1024 * 1024},
		// Se va guardar en el servidor
		storage: fileStorage = multer.diskStorage({
			destination: (req, file, cb) => {
				cb(null, __dirname+'/../uploads')
			},
			filename: (req, file, cb) => {
				/* mimetipe conteiene la extension del archivo,separamos
				el archivos porque viene como eje: image/jpeg*/
				// const extension = file.mimetype.split('/')[1]
				const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
				cb(null, `${shortid.generate()}${extension}`)
			}
			// Filtrar archivos
			/* fileFilter: (req, file, cb) => {
				if(file.mimetype === "application/pdf") {
					return cb(null, true)
				}
			} */
		})
	}
	//Key para el form-data
	const upload = multer(configuracionMulter).single('archivo')


	upload(req, res, async(error) => {
		console.log(req.file);

		//Si todo sale bien retornar esta respuesta
		if(!error) {
			res.json({archivo: req.file.filename})
		} else {
			console.log(error);
			return next()
		}
	})
}

exports.eliminarArchivo = async (req, res) => {
	console.log(req.archivo);

	try {
		fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`)
		console.log('Archivo eliminado');
	} catch (error) {
		console.log(error);
	}
}

// Descarga un archivo
exports.descargar = async(req, res, next) => {

	// Obtener el enlace
	const {archivo} = req.params
	const enlace = await Enlaces.findOne({nombre: archivo})

	// Obtener el archivo
	const archivoDescarga = __dirname + '/../uploads/' + archivo
	res.download(archivoDescarga)

	// Eliminar el archivo y la entrada a la BD
	// Si las descargas son iguales a 1 | Borrar la entrada y borrar el archivo
	const {descargas, nombre} = enlace

	if(descargas === 1) {
		// Eliminar el archivo
		req.archivo = nombre

		// Eliminar la entrada de la BD
		await Enlaces.findOneAndRemove(enlace.id)
		/* Se ejecuta el siguiente controlador de acuerdo al orden
		que se declaro en routes/enlaces*/
		next()
	} else {
		// Si las descargas son > a 1 | Restar 1
		enlace.descargas--
		await enlace.save()
	}
}