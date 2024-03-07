/*
Rutas de usuarios /auth
host + /api/auth
esta es la ruta de la que venimos, para hacer uso de las rutas definidas en este archibo se pondra la ruta de la cual venimos mas el path de cada ruta
ejemplo:
/api/auth/new
de esa manera llamamos la petición post con el callback createUser
*/

const express = require('express')
const router = express.Router() // Elemento necesario para definir las diferentes rutas y sus tipos de petición
const { check } = require('express-validator')

const { createUser, loginUser, renewToken } = require('../controllers/auth') // Importacion de los calbacks
const { validarCampos } = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

router.post(
  '/new', /* Direccion de la peticioon */
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El no es valido').isEmail(),
    check('password', 'La contraseña debe tener 6 caracteres').isLength({ min: 6 }),
    validarCampos
  ], /* Miglewares */
  createUser /* callback */
) // callback se esta importando del el archivo ../controllers/auth

router.post(
  '/',
  [
    check('password', 'La contraseña debe tener 6 caracteres').isLength({ min: 6 }),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos
  ],
  loginUser) // callback se esta importando del el archivo ../controllers/auth

router.get('/renew', validarJWT, renewToken) // callback se esta importando del el archivo ../controllers/auth

module.exports = router // Exportacion para que sea usada en index.js
