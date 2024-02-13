const Comands = require('../ComandsModels/ComandsModels');

async function addComands(req, res) {
  try {
    console.log('Creando Producto:');
    const ComandsData = req.body;
    if (!ComandsData.Comands || !ComandsData.precio) {
      return res.status(400).json({ error: 'El nombre del Producto y el precio son campos obligatorios' });
    }

    const ComandsToBeAdded = new Comands({
      producto:ComandsData.Comands,
      precio:ComandsData.precio,
      cantidad:ComandsData.cantidad,
      imagen:ComandsData.imagen


    });

    await ComandsToBeAdded.save();

    console.log('Producto Creado:', ComandsToBeAdded);
    res.json({ Mensaje: 'Producto creado correctamente', createdComands: ComandsToBeAdded });
  } catch (error) {
    console.error('Error al crear el Producto:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


async function getComands(req, res) {
  try {
    console.log('Mostrando lista de Productos');
    const Comandss = await Comands.find();

    if (!Comandss || Comandss.length === 0) {
      return res.status(404).json({ error: 'No se encontraron Productos en BD' });
      
    } 

    return res.json(Comandss);
  } catch (error) {
    console.error('Error al obtener la lista de Productos:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function updateComands(req, res) {
  try {
    console.log('Actualizar Producto:');
    const idOfComandsToUpdate = req.params.id;
    const dataToUpdate = req.body;

    const updatedComands = await Comands.findByIdAndUpdate(idOfComandsToUpdate, dataToUpdate, { new: true });

    if (!updatedComands) {
      return res.status(404).json({ error: `No se encontró el Producto con ID ${idOfComandsToUpdate}` });
    }

    return res.json({ Mensaje: `Producto actualizado: ${idOfComandsToUpdate}`, updatedComands });
  } catch (error) {
    console.error('Error al actualizar el Producto:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function deleteComands(req, res) {
  try {
    console.log('Eliminar Producto');
    const idOfComandsToBeDeleted = req.params.id;

    const deletedComands = await Comands.findByIdAndDelete(idOfComandsToBeDeleted);

    if (!deletedComands) {
      return res.status(404).json({ error: `No se encontró el Producto con ID ${idOfComandsToBeDeleted}` });
    }

    return res.json({ Mensaje: `Producto borrado: ${idOfComandsToBeDeleted}` });
  } catch (error) {
    console.error('Error al eliminar el Producto:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  addComands,
  getComands,
  updateComands,
  deleteComands
};
