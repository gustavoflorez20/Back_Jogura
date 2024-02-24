const Products = require('../ProductsModels/ProductsModels');
const { Resend } = require('resend');
const resend = new Resend();

async function addProducts(req, res) {
  let createdProducts;

  try {
    console.log('Creando Pedido:');
    const carData = req.body.car;

    const productsToBeAdded = carData.map((productData) => {
      return new Products({
        cantidad: productData.cantidad,
        id: productData.id,
        name: productData.name,
        precio: productData.price,
        shortDescription: productData.shortDescription,
        Image: productData.image,
      });
    });

    createdProducts = await Products.insertMany(productsToBeAdded);

    console.log('Pedido Creado:', createdProducts);

    await sendEmailProductos(req, res);

    
    return;

  } catch (error) {
    console.error('Error al crear los Productos:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }

  
  res.json({ Mensaje: 'Productos creados correctamente', createdProducts });
}

async function getProducts(req, res) {
  try {
    console.log('Mostrando lista de Pedidos');
    const Productss = await Products.find();

    if (!Productss || Productss.length === 0) {
      return res.status(404).json({ error: 'No se encontraron Pedidos en BD' });
    } 

    return res.json(Productss);
  } catch (error) {
    console.error('Error al obtener la lista de Pedidos:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function updateProducts(req, res) {
  try {
    console.log('Actualizar Pedido:');
    const idOfProductsToUpdate = req.params.id;
    const dataToUpdate = req.body;

    const updatedProducts = await Products.findByIdAndUpdate(idOfProductsToUpdate, dataToUpdate, { new: true });

    if (!updatedProducts) {
      return res.status(404).json({ error: `No se encontró el Pedido con ID ${idOfProductsToUpdate}` });
    }

    return res.json({ Mensaje: `Producto actualizado: ${idOfProductsToUpdate}`, updatedProducts });
  } catch (error) {
    console.error('Error al actualizar el Producto:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function deleteProducts(req, res) {
  try {
    console.log('Eliminar Producto');
    const idOfProductsToBeDeleted = req.params.id;

    const deletedProducts = await Products.findByIdAndDelete(idOfProductsToBeDeleted);

    if (!deletedProducts) {
      return res.status(404).json({ error: `No se encontró el Producto con ID ${idOfProductsToBeDeleted}` });
    }

    return res.json({ Mensaje: `Producto borrado: ${idOfProductsToBeDeleted}` });
  } catch (error) {
    console.error('Error al eliminar el Producto:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function sendEmailProductos(req, res) {
  try {
    const productData = req.body.productData;

    const emailOptions = {
      from: 'Tequetapas <tequetapas@resend.dev>',
      to: ['gustavoflorez20@gmail.com'],
      subject: 'Comanda',
      html: '<strong>Recomanda</strong>',
    };

    const { data, error } = await resend.emails.send(emailOptions);

    if (error) {
      console.error({ error });
      res.status(500).json({ error: 'Error al enviar el correo electrónico' });
    } else {
      console.log(`Pedido enviado exitosamente`);
      res.status(200).json({ message: 'Pedido enviado exitosamente al Email.' });
    }
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  addProducts,
  getProducts,
  updateProducts,
  deleteProducts,
  sendEmailProductos
};
