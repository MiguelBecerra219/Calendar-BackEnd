const { response } = require('express') // Hacemos uso de la respuesta para que funcione bien el autoComplit, La pasamos como valor predeterminado en las funciones:  res = response
const User = require('../models/User-model') // Importamos el modelo de usuario, donde esta la estructura que este debe tener
const bcrypt = require('bcryptjs')
const { generarJWT } = require('../helpers/jwt') // Generador de tokens

// Definicion de los callbacks para ser usados en las routes en auth.js routes

// *
// Funcion de crear usuario
const createUser = async (req, res = response) => {
  const { email, password } = req.body // Desestructuración de los datos del usuario para usarlos en las validaciones

  try {
    let user = await User.findOne({ email }) // Esta funcion nos regresa el usuario que coincida con el dato, si no hay devuelve null
    console.log(user)

    if (user) { // Si el usuario existe devolvemos este error
      return res.status(400).json({
        ok: false,
        msg: 'Un usuario ya existe con ese correo'
      })
    } // si no, pasamos a crearlo y grabarlo

    user = new User(req.body) // Creamos una instancia de usuario con la info recivida
    // encriptar contraseña
    const salt = bcrypt.genSaltSync() // Creamos el encriptador de contraseñas el parametro es el numero de vueltas que queremos que de la encriptacion por defecto es 10 este valor es suficiente
    user.password = bcrypt.hashSync(password, salt) // cambiamos la contraseña anterior por la encriptada

    await user.save() // Guardamos el registro en la base de datos, esta se especifica en la configuracion

    // Generar nuestro JWT con nuestro helper de creación+
    const token = await generarJWT(user.id, user.name)

    res.status(201).json({ // Envamos una respuesta
      ok: true,
      uid: user.id,
      name: user.name,
      token
    })

    // En caso de error
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    })
  }
}

// *
// *
// Funcion de login user

const loginUser = async (req, res = response) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email }) // Esta funcion nos regresa el usuario que coincida con el dato, si no hay devuelve null
    if (!user) { // Si el usuario existe devolvemos este error
      return res.status(400).json({
        ok: false,
        msg: 'El usuario no existe'
      })
    } // si si hay, pasamos a la validacion de la contraseña

    // Confirmar la contraseña
    const validPassword = bcrypt.compareSync(password, user.password) // comparamos las contraseñas para ver si son iguales, esto devuelve true o false
    if (!validPassword) { // Si no coincide entregamos un error
      return res.status(400).json({
        ok: false,
        msg: 'Contraseña incorrecta'
      })
    }

    // Generar nuestro JWT con nuestro helper de creación
    const token = await generarJWT(user.id, user.name)

    res.status(201).json({ // Envamos una respuesta
      ok: true,
      uid: user.id,
      name: user.name,
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    })
  }
}

// *
// Funcion de renovacion de token
const renewToken = async (req, res = response) => {
  // Extraemos la informacion de la req
  // Esta fue guardada alli en el middleware
  const uid = req.uid
  const name = req.name

  // Generamos un nuevo otken
  const token = await generarJWT(uid, name)

  res.json({
    ok: true,
    msg: 'renew',
    token
  })
}

// Exportacion para que se puedan llamar en donde las necesitamos
module.exports = {
  createUser,
  loginUser,
  renewToken
}
