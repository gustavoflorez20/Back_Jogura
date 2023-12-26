
const  Product  = require ('../ProductModels/ProductModels')

async function addProduct(req, res) {
    try {
      console.log('Agregando Producto:');
      const productData = req.body;
      if (!productData.nameProduct || !productData.price) {
        return res.status(400).json({ error: 'El nombre del producto y el precio son campos obligatorios' });
      }
  
      const productToBeAdded = new Product(productData);
      await productToBeAdded.save();
  
      console.log('Este es el producto que hemos agregado:', productToBeAdded);
      res.json({ text: 'Producto agregado correctamente', addedProduct: productToBeAdded });
    } catch (error) {
      console.error('Error al agregar el producto:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  

async function getProduct(req, res) {
    try {
      console.log('Mostrando la lista de Productos');
      const products = await Product.find();
  
      if (!products || products.length === 0) {
        return res.status(404).json({ error: 'No se encontraron Productos' });
      }
  
      return res.json(products);
    } catch (error) {
      console.error('Error al obtener la lista de Productos:', error.message);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

    async function updateProduct(req, res) {
        try {
          console.log('Actualizar un Producto');
          const idOfProductToUpdate = req.params.id;
          const dataToUpdate = req.body;
      
          const updatedProduct = await Product.findByIdAndUpdate(idOfProductToUpdate, dataToUpdate, { new: true });
      
          if (!updatedProduct) {
            return res.status(404).json({ error: `No se encontró el producto con ID ${idOfProductToUpdate}` });
          }
      
          return res.json({ text: `Producto actualizado: ${idOfProductToUpdate}`, updatedProduct });
        } catch (error) {
          console.error('Error al actualizar el producto:', error.message);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }
      }
   

    async function deleteProduct(req, res) {
        try {
          console.log('Eliminar producto');
          const idOfProductToBeDeleted = req.params.id;
      
          const deletedProduct = await Product.findByIdAndDelete(idOfProductToBeDeleted);
      
          if (!deletedProduct) {
            return res.status(404).json({ error: `No se encontró el producto con ID ${idOfProductToBeDeleted}` });
          }
      
          return res.json({ text: `Producto borrado: ${idOfProductToBeDeleted}` });
        } catch (error) {
          console.error('Error al eliminar el producto:', error.message);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }
      }
 

module.exports = {
    addProduct,
    getProduct,
    updateProduct,
    deleteProduct
    
   
}