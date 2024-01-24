const mongoose = require ('mongoose');
const { Schema } = mongoose;
const addEuroSymbol = (value) => `${value} €`;


const DairySchema = new Schema({
  congelado: String,
  cantidad: Number,
  precio:{
    set: addEuroSymbol,
    type: String
  },
  imagen:String

});

const Dairy = mongoose.model('Dairy', DairySchema);

module.exports = Dairy 
