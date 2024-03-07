
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
app.use(cors());
app.use(express.json());



const ProductsRouter = require('./Back_Products/ProductsRouter/ProductsRouter');
const UserRouter = require('./Back_User/UserRoutes/UserRouter');
const DairyRouter = require('./Back_Dairy/DairyRouter/DairyRouter');
const ComandsRouter = require('./Back_Comands/ComandsRouter/ComandsRouter');


mongoose.connect(process.env.MONGODB_URL_PROD)
.then(() => console.log('Conectada BD  Productos Jogura http://localhost:3001/Products'))
.catch((error) => console.error('Hay un error:', error));

const userDBConnection = mongoose.createConnection(process.env.MONGODB_URL_USER);
userDBConnection.on('open', () => {
console.log('Conectada BD de  Usuarios  Jogura http://localhost:3001/User');
});

const DairyDBDConnection = mongoose.createConnection(process.env.MONGODB_URL_Dairy);
DairyDBDConnection.on('open', () => {
  console.log('Conectada BD de Lacteos Jogura http://localhost:3001/Dairy');
});


const ComandsDBDConnection = mongoose.createConnection(process.env.MONGODB_URL_Comands);
ComandsDBDConnection.on('open', () => {
  console.log('Conectada BD de Comandas Jogura http://localhost:3001/Comands');
});
app.use('/Products', ProductsRouter);
app.use('/User', UserRouter);
app.use('/Congelados', DairyRouter);
app.use('/Comandas', ComandsRouter);







app.listen(port, () => {
    console.log(`Server Funcionando en  ${port}`)
})   