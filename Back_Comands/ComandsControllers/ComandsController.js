const Comands = require('../ComandsModels/ComandsModels');
const { Resend } = require('resend');


async function addComands(req, res) {
  try {
    console.log('Creando Comands:');
    const ComandsData = req.body;
    if (!ComandsData.Comands || !ComandsData.precio) {
      return res.status(400).json({ error: '' });
    }

    const ComandsToBeAdded = new Comands({
      Comanda:ComandsData.Comands,
      precio:ComandsData.precio,
      cantidad:ComandsData.cantidad,
      imagen:ComandsData.imagen


    });

    await ComandsToBeAdded.save();

    console.log('Comands Creado:', ComandsToBeAdded);
    res.json({ Mensaje: 'Comanda creado correctamente', createdComands: ComandsToBeAdded });
  } catch (error) {
    console.error('Error al crear el Comands:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


async function getComands(req, res) {
  try {
    console.log('Mostrando lista de Comandas');
    const Comandss = await Comands.find();

    if (!Comandss || Comandss.length === 0) {
      return res.status(404).json({ error: 'No se encontraron Comandas en BD' });
      
    } 

    return res.json(Comandss);
  } catch (error) {
    console.error('Error al obtener la lista de Comandas:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function updateComands(req, res) {
  try {
    console.log('Actualizar Comanda:');
    const idOfComandsToUpdate = req.params.id;
    const dataToUpdate = req.body;

    const updatedComands = await Comands.findByIdAndUpdate(idOfComandsToUpdate, dataToUpdate, { new: true });

    if (!updatedComands) {
      return res.status(404).json({ error: `No se encontró el Comanda con ID ${idOfComandsToUpdate}` });
    }

    return res.json({ Mensaje: `Comanda actualizado: ${idOfComandsToUpdate}`, updatedComands });
  } catch (error) {
    console.error('Error al actualizar el Comanda:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

async function deleteComands(req, res) {
  try {
    console.log('Eliminar Comanda');
    const idOfComandsToBeDeleted = req.params.id;

    const deletedComands = await Comands.findByIdAndDelete(idOfComandsToBeDeleted);

    if (!deletedComands) {
      return res.status(404).json({ error: `No se encontró el Comanda con ID ${idOfComandsToBeDeleted}` });
    }

    return res.json({ Mensaje: `Comanda borrado: ${idOfComandsToBeDeleted}` });
  } catch (error) {
    console.error('Error al eliminar el Comanda:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

 
const resend = new Resend();

async function sendEmailComands(req, res) {
  const { email } = req.body;
  const ComandsData = req.body;

  const emailOptions = {
    from: 'Tequetapas <tequetapas@resend.dev>',
    to: ['gustavoflorez20@gmail.com'] , //email,
    subject: 'Comanda',
    html: `
      <strong>Pedido</strong>
      <p>Detalles del pedido:</p>
      <p>Comanda: ${ComandsData.Comands}</p>
      <p>Precio: ${ComandsData.precio}</p>
      <p>Cantidad: ${ComandsData.cantidad}</p>
      <p>Imagen: <img src="${ComandsData.imagen}" alt="Imagen del producto" /></p>
    `,
  };

  try {
    const { data, error } = await resend.emails.send(emailOptions);
    if (error) {
      console.error({ error });
      res.status(500).json({ error: 'Error al enviar el correo electrónico' });
    } else {
      console.log({ email });
      res.status(200).json({ message: 'Correo electrónico enviado exitosamente.' });
    }
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  addComands,
  getComands,
  updateComands,
  deleteComands,
  sendEmailComands
};
