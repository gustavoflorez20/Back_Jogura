const mongoose = require ('mongoose');
const { Schema } = mongoose;
const addEuroSymbol = (value) => `${value} €`;

const ProductSchema = new Schema({
  nameProduct: String,
  type: String,
  price: {
    set: addEuroSymbol,
    type: String
     
  },
  amount: Number,
  description: String,
  recipeBook: String,
  allergens: String
  

});
const Product = mongoose.model('Product', ProductSchema);

module.exports = Product 
