const { response } = require('express')
const jwt = require('jsonwebtoken')

const validarJWT = (req, res = response, next) => {
  // x-token header
  const token = req.header('x-token') // obtenemos el token enviado en el requerimiento
  // Verificamos que el token venga
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No hay token en la petición'
    })
  }

  // En caso de tener un token
  try {
    // Extraemos la ingformacion uid y name del roken
    const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED)
    // Almacenamos la informacion del token en la req
    req.uid = uid
    req.name = name

    // En caso de fallo
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no valido'
    })
  }

  next()
}

module.exports = {
  validarJWT
}
