const mongoose = require ('mongoose');
const { Schema } = mongoose;
const addEuroSymbol = (value) => `${value} €`;


const ProductsSchema = new Schema({
  producto: String,
  cantidad: Number,
  precio:{
    set: addEuroSymbol,
    type: String
     
  },
  descripcion:String

});

const Products = mongoose.model('Products', ProductsSchema);

module.exports = Products 
