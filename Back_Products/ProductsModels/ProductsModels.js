const mongoose = require ('mongoose');
const { Schema } = mongoose;
const addEuroSymbol = (value) => `${value} €`;


const ProductsSchema = new Schema({
  cantidad: String,
  id: Number,
  image: String,
  name: String,
  precio:Number,
 shortDescription: String

});

const Products = mongoose.model('Products', ProductsSchema);

module.exports = Products 