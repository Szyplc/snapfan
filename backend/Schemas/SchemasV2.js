const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ankietySchema = new Schema({
  idUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ankietaDataczasUtworzenia: { type: Date, required: true }
});

const Ankiety = mongoose.model('Ankiety', ankietySchema);

module.exports = Ankiety;