const mongoose = require ('mongoose');
const { Schema } = mongoose;


const ProductsSchema = new Schema({
  producto: String,
  cantidad: Number,
  precio:Number,
  descripcion:String

});

const Products = mongoose.model('Products', ProductsSchema);

module.exports = Products 
