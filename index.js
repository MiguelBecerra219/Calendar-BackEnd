// Importacion de express
const express = require('express')
// Uso de las variables de entorno
require('dotenv').config()

// Crear el servidor de express
const app = express() // llamamos a express, este nos devolvera un servidor

// Base de datos
const { dbConnection } = require('./db/config')
dbConnection()

// CORS Seguridad
const cors = require('cors')
app.use(cors())

// Directorio publico
// Esto lleva a la carpeta public donde estara nuestra app de react
app.use(express.static('public')) // Midleware

// Lectura y parseo del body
app.use(express.json()) // Se almacenan todos los json enviados en el posteo para usarlo en el auht
// Esta info quedara almacenada en req.body

// Rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/event', require('./routes/event'))

// Escuchar peticiones
app.listen(process.env.PORT /* Primer parametro es el puerto != de 3000 */, () => { /* El segundo es una funcion que se ejecutara cuando el servidor este arriba */
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
})
