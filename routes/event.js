/*
 Event Routes
 /api/event
*/

const { getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/events')
const express = require('express')
const { validarJWT } = require('../middlewares/validar-jwt')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { isDate } = require('../helpers/isDate')
const router = express.Router()

// Para evitar enviar el middleware en cada una de las rutas
// podemos añadirlo de esta manera
router.use(validarJWT) // Todas las turas aplicaran este middleware

// Todas deben ser validadas, con el JWT
// Obtener eventos
router.get('/', getEvent)

// Crear nuevo evento
router.post(
  '/',
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'La fecha de inicio es obligatoria').custom(isDate),
    check('start', 'La fecha de finalizacion es obligatoria').custom(isDate),
    validarCampos
  ],
  createEvent)

// Actualizar evento evento
router.put('/:id', [
  check('title', 'El titulo es obligatorio').not().isEmpty(),
  check('start', 'Fecha de inicio es obligatoria').custom(isDate),
  check('end', 'Fecha de finalización es obligatoria').custom(isDate),
  validarCampos
], updateEvent)

// Borrar evento evento
router.delete('/:id', deleteEvent)

module.exports = router
