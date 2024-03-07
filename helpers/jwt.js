const jwt = require('jsonwebtoken')

const generarJWT = (uid, name) => {
  return new Promise((resolve, reject) => {
    // Creamos el payload para almacenarlo en el JWT
    const payload = { uid, name }
    // Generamos el token
    // Enviamos el token, la palabra secreta, el tiempo de expiración del token y el callback pa que se ejecute
    jwt.sign(payload, process.env.SECRET_JWT_SEED, {
      expiresIn: '2h'
    }, (err, token) => {
      if (err) {
        console.log(err)
        reject(err, 'No se pudo generar el token')
      }

      resolve(token)
    })
  })
}

module.exports = {
  generarJWT
}
