
const  User  = require ('../ProductModels/UserModels')

async function addUser(req, res) {
    try {
      console.log('Creando Usuario:');
      const userData = req.body;
      if (!userData.nameUser || !userData.email) {
        return res.status(400).json({ error: 'El nombre de usuario y el correo electrónico son campos obligatorios' });
      }
  
      const userToBeAdded = new User(userData);
      await userToBeAdded.save();
  
      console.log('Usuario Creado:', userToBeAdded);
      res.json({ text: 'Usuario creado correctamente', createdUser: userToBeAdded });
    } catch (error) {
      console.error('Error al crear el usuario:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  

  async function getUser(req, res) {
    try {
      console.log('Mostrando lista de Usuarios');
      const users = await User.find();
  
      if (!users || users.length === 0) {
        return res.status(404).json({ error: 'No se encontraron usuarios en BD' });
      }
  
      return res.json(users);
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error.message);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  

  async function updateUser(req, res) {
    try {
      console.log('Actualizar Usuario:');
      const idOfUserToUpdate = req.params.id;
      const dataToUpdate = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(idOfUserToUpdate, dataToUpdate, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ error: `No se encontró el usuario con ID ${idOfUserToUpdate}` });
      }
  
      return res.json({ text: `Usuario actualizado: ${idOfUserToUpdate}`, updatedUser });
    } catch (error) {
      console.error('Error al actualizar el usuario:', error.message);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  
   

  async function deleteUser(req, res) {
    try {
      console.log('Eliminar Usuario');
      const idOfUserToBeDeleted = req.params.id;
  
      const deletedUser = await User.findByIdAndDelete(idOfUserToBeDeleted);
  
      if (!deletedUser) {
        return res.status(404).json({ error: `No se encontró el usuario con ID ${idOfUserToBeDeleted}` });
      }
  
      return res.json({ text: `Usuario borrado: ${idOfUserToBeDeleted}` });
    } catch (error) {
      console.error('Error al eliminar el usuario:', error.message);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  
 

module.exports = {
    addUser,
    getUser,
    updateUser,
    deleteUser
    
   
}