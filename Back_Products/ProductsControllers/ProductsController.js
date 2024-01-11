const Products = require('../ProductsModels/ProductsModels');

async function addProducts(req, res) {
  try {
    console.log('Creando Producto:');
    const ProductsData = req.body;
    if (!ProductsData.producto || !ProductsData.precio) {
      return res.status(400).json({ error: 'El nombre del Producto y el precio son campos obligatorios' });
    }

    const ProductsToBeAdded = new Products(ProductsData);
    await ProductsToBeAdded.save();

    console.log('Producto Creado:', ProductsToBeAdded);
    res.json({ Mensaje: 'Producto creado correctamente', createdProducts: ProductsToBeAdded });
  } catch (error) {
    console.error('Error al crear el Producto:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function getProducts(req, res) {
  try {
    console.log('Mostrando lista de Productos');
    const Productss = await Products.find();

    if (!Productss || Productss.length === 0) {
      return res.status(404).json({ error: 'No se encontraron Productos en BD' });
      
    } 

    return res.json(Productss);
  } catch (error) {
    console.error('Error al obtener la lista de Productos:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function updateProducts(req, res) {
  try {
    console.log('Actualizar Producto:');
    const idOfProductsToUpdate = req.params.id;
    const dataToUpdate = req.body;

    const updatedProducts = await Products.findByIdAndUpdate(idOfProductsToUpdate, dataToUpdate, { new: true });

    if (!updatedProducts) {
      return res.status(404).json({ error: `No se encontró el Producto con ID ${idOfProductsToUpdate}` });
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

module.exports = {
  addProducts,
  getProducts,
  updateProducts,
  deleteProducts
};
