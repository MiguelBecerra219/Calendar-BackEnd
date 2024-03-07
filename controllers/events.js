const { response } = require('express')
const Event = require('../models/Event-model')

const getEvent = async (req, res = response) => {
  const events = await Event.find().populate('user', 'name')
  res.json({
    ok: true,
    events
  })
}

const createEvent = async (req, res = response) => {
  const event = new Event(req.body)

  try {
    event.user = req.uid

    const eventSaved = await event.save()
    res.json({
      ok: true,
      eventSaved
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error no esperado'
    })
  }
}

const updateEvent = async (req, res = response) => {
  const eventId = req.params.id
  const uid = req.uid

  try {
    const event = await Event.findById(eventId)

    // Validamos que el evento exista si no existe devolvemos el error
    if (!event) {
      res.status(404).json({
        ok: false,
        msg: 'Evento no existe con  este id'
      })
    }

    // Validamos que el usuario que intenta editar es el mismo que creo la nota
    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene permisos para editar este evento'
      })
    }

    // Creamos el nuevo evento que se guardara
    // Este tiene todos los datos enviados en el body de la peticion
    // Y tambien el id del usuario que extragimos ya que este id viene en la peticion pero no como body si no como JWT
    const newEvent = {
      ...req.body,
      user: uid
    }

    // Guardamos en la base de datos
    // La funcion recive como parametros el id del evento a acutualizar, un objeto que sera el nuevo evento (Este debe contener todo los datos asi no se actualicen todos)
    // ademas como tercer parametro recibe unas configuraciones en este caso le decimos que nos retorne el objeto actualizado ya que por defecto retorna el antiguo
    const eventUpdated = await Event.findByIdAndUpdate(eventId, newEvent, { new: true })

    // Respondemos de manera correcta con los datos actualizaidas
    res.json({
      ok: true,
      msg: 'updateEvent',
      event: eventUpdated
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el admin'
    })
  }
}

const deleteEvent = async (req, res = response) => {
  const eventId = req.params.id
  const uid = req.uid

  try {
    const event = await Event.findById(eventId)

    // Validamos que el evento exista si no existe devolvemos el error
    if (!event) {
      res.status(404).json({
        ok: false,
        msg: 'Evento no existe con  este id'
      })
    }

    // Validamos que el usuario que intenta editar es el mismo que creo la nota
    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene permisos para eliminar este evento'
      })
    }

    // Borramos el evento de la DB
    const eventDeleted = await Event.findByIdAndDelete(eventId)

    // Respondemos con el evento borrado
    res.json({
      ok: true,
      msg: 'DeleteEvent',
      event: eventDeleted
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el admin'
    })
  }
}

module.exports = {
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
}
