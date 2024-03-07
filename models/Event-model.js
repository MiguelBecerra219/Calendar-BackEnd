const { Schema, model } = require('mongoose')

// Esta es la forma que va a tener un registro de tipo usuario
const EventSchema = Schema({
  title: {
    type: String, // Tipo de dato
    required: true // Obligatoriedad
  },
  notes: {
    type: String
  },
  start: {
    type: Date,
    requiered: true
  },
  end: {
    type: Date,
    requiered: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    requiered: true
  }
})

EventSchema.method('toJSON', function () {
  const { __v, _id, ...obj } = this.toObject()
  obj.id = _id
  return obj
})

module.exports = model('Event', EventSchema)
