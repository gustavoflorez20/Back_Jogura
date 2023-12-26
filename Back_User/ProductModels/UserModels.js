const mongoose = require ('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
  nameUser: String,
  lastNameUser: String,
  email: { type: String, unique: true },
  tlf: Number,
  pasw: String,
  address: String 
});

const User = mongoose.model('User', UserSchema);

module.exports = User 
