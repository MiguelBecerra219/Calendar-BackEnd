const { Schema, model } = require('mongoose')

// Esta es la forma que va a tener un registro de tipo usuario
const UserSchema = Schema({
  name: {
    type: String, // Tipo de dato
    required: true // Obligatoriedad
  },
  email: {
    type: String,
    require: true,
    uniqued: true // El contenido debe ser unico en la base de datos
  },
  password: {
    type: String,
    requiered: true
  }
})

module.exports = model('User', UserSchema)
