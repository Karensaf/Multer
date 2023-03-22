const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')

//* Crear el storage engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now()+ path.extname(file.originalname))
    }
}) 

//* Inicializanco a upload
const upload = multer({
    storage: storage,
    limits: {FileSyze: 1000000},
    fileFilter: function(req, file, cb) {
        checkFileType(file,cb)
    }
}).single('myImage')

//* Checamos el tipo de archivo que vamos a subir
function checkFileType(file, cb){
    //? Extenciones permitidas
    const fileTypes = /jpeg|jpg|png|gif/



    //? Verificamos la extension
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())

    //? Verificamos el mimetype Para verificar q sea una foto aun con cambio de nombre
    const mimetype = fileTypes.test(file.mimetype)
    
    if(mimetype && extname){
        return cb(null, true)
    } else {
        cb('Error, Sólo se admiten imagenes')
    }

}

//* Inicializamos la app
const app = express()

//* EJS
app.set('view engine', 'ejs')

//* Carpeta public
app.use(express.static('./public'))

app.get('/', (req, res) => res.render('index'))

app.post('/upload', (req, res) => {
    //res.send('probando')
    upload(req, res, (err) => {
        if(err) {
            res.render('index', {
                msg: err
            })
        } else {
            if(req.file ==undefined) {
                res.render('index', {
                    msg: 'Error: No seleccionaste ningún archivo'
                })
            } else {
                res.render('index', {
                    msg: 'El archivo subio correctamente',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })
})

const port = 3000

app.listen(port, () => console.log(`Servidor Iniciado en el puerto ${port}`))