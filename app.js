
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

mongoose.connect(process.env.MONGODB_URL_PROD)
.then(() => console.log('Conectada BD de los Productos Jogura http://localhost:3001/Products'))
.catch((error) => console.error('Hay un error:', error));

const userDBConnection = mongoose.createConnection(process.env.MONGODB_URL_USER);
userDBConnection.on('open', () => {
console.log('Conectada BD de los Usuarios  Jogura http://localhost:3001/User');
});

app.use('/Products', ProductsRouter);
app.use('/User', UserRouter);



app.listen(port, () => {
    console.log(`Server Funcionando en  ${port}`)
})   