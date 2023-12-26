const express = require('express')
const mongoose  = require ('mongoose')

const app = express()
const port = 3001
const cors = require("cors");


const ProductsRouter = require('./Back_Product/Productroutes/ProductRouter');
const UserRouter = require('./Back_User/UserRoutes/UserRouter');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://gutavo:Clio2018*@cluster0.f8klybc.mongodb.net/Product')
  .then(() => console.log('Conectada BD de los Productos Jogura http://localhost:3001/Products'))
  .catch((error) => console.log('Hay un error:', error));

  const userDBConnection = mongoose.createConnection('mongodb+srv://gutavo:Clio2018*@cluster0.f8klybc.mongodb.net/User');
  userDBConnection.on('open', () => {
    console.log('Conectada BD de los Usuarios  Jogura http://localhost:3001/User');
  });

app.use('/Products', ProductsRouter);
app.use('/User', UserRouter);



app.listen(port, () => {
    console.log(`Server Funcionando en  ${port}`)
})