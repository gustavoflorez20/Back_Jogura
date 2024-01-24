const Dairy = require('../DairyModels/DairyModels');

async function addDairy(req, res) {
  try {
    console.log('Creando Producto:');
    const DairyData = req.body;
    if (!DairyData.Dairy || !DairyData.precio) {
      return res.status(400).json({ error: 'El nombre del Producto y el precio son campos obligatorios' });
    }

    const DairyToBeAdded = new Dairy({
      producto:DairyData.Dairy,
      precio:DairyData.precio,
      cantidad:DairyData.cantidad,
      imagen:DairyData.imagen


    });

    await DairyToBeAdded.save();

    console.log('Producto Creado:', DairyToBeAdded);
    res.json({ Mensaje: 'Producto creado correctamente', createdDairy: DairyToBeAdded });
  } catch (error) {
    console.error('Error al crear el Producto:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


async function getDairy(req, res) {
  try {
    console.log('Mostrando lista de Productos');
    const Dairys = await Dairy.find();

    if (!Dairys || Dairys.length === 0) {
      return res.status(404).json({ error: 'No se encontraron Productos en BD' });
      
    } 

    return res.json(Dairys);
  } catch (error) {
    console.error('Error al obtener la lista de Productos:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function updateDairy(req, res) {
  try {
    console.log('Actualizar Producto:');
    const idOfDairyToUpdate = req.params.id;
    const dataToUpdate = req.body;

    const updatedDairy = await Dairy.findByIdAndUpdate(idOfDairyToUpdate, dataToUpdate, { new: true });

    if (!updatedDairy) {
      return res.status(404).json({ error: `No se encontró el Producto con ID ${idOfDairyToUpdate}` });
    }

    return res.json({ Mensaje: `Producto actualizado: ${idOfDairyToUpdate}`, updatedDairy });
  } catch (error) {
    console.error('Error al actualizar el Producto:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function deleteDairy(req, res) {
  try {
    console.log('Eliminar Producto');
    const idOfDairyToBeDeleted = req.params.id;

    const deletedDairy = await Dairy.findByIdAndDelete(idOfDairyToBeDeleted);

    if (!deletedDairy) {
      return res.status(404).json({ error: `No se encontró el Producto con ID ${idOfDairyToBeDeleted}` });
    }

    return res.json({ Mensaje: `Producto borrado: ${idOfDairyToBeDeleted}` });
  } catch (error) {
    console.error('Error al eliminar el Producto:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  addDairy,
  getDairy,
  updateDairy,
  deleteDairy
};
