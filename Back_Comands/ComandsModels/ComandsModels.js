const mongoose = require ('mongoose');
const { Schema } = mongoose;
const addEuroSymbol = (value) => `${value} €`;


const ComandsSchema = new Schema({
  producto: String,
  cantidad: Number,
  precio:{
    set: addEuroSymbol,
    type: String
  },
  imagen:String

});

const Comands = mongoose.model('Comands', ComandsSchema);

module.exports = Comands 
