
const UserModel = require('../UsertModels/UserModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mySalt=10;
const mySecret = 'BANANASECRETO'

const addUser = async (req, res) => {
  console.log('Iniciando proceso de registro de usuario...');

  // encriptamos la password
  const encryptedPassword = await bcrypt.hash(req.body.password, mySalt);

  console.log('Creando usuario en la base de datos...');
  UserModel.create(
      {
          email: req.body.email,
          password: encryptedPassword,
      }
  ).then(userDoc => {
      console.log('Usuario creado exitosamente:', userDoc);
      res.status(200).send(userDoc);
  }).catch(error => {
      console.log('Error durante la creación del usuario:', error.code);

      switch (error.code) {
          default:
              res.status(400).send(error);
      }
  });
};

   

 
const checkUser = async (req, res) => {
  const { email, password } = req.body;

  console.log('Buscando usuario en la base de datos...');
  const [userFound] = await UserModel.find({ email: email });

  if (!userFound) {
      console.log('Usuario no encontrado.');
      return res.status(404).json({ msg: 'Usuario no Encontrado' });
  }

  console.log('Usuario encontrado. Verificando contraseña...');
  const isPasswordMatch = await bcrypt.compare(password, userFound.password);

  if (isPasswordMatch) {
      console.log('Contraseña válida. Generando token...');
      const token = jwt.sign({ email: userFound.email }, mySecret, { expiresIn: 60 });

      console.log('Token generado. Usuario autenticado.');
      return res.status(200).json({ msg: 'Hola, estás logueado', token });
  }

  console.log('Contraseña incorrecta.');
  return res.status(404).json({ msg: 'Password no coincide' });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
      console.log('Token faltante.');
      return res.status(404).json({ msg: 'Falta token!!!!' });
  }

  try {
      console.log('Verificando token...');
      jwt.verify(token, mySecret);
      console.log('Token válido. Continuando con la siguiente función...');
      return next();
  } catch (error) {
      console.log('Token no válido o expirado.');
      return res.status(404).json({ msg: 'Token no valido o expirado' });
  }
};

async function getUser(req, res) {
    try {
      console.log('Mostrando lista de Usuarios');
      const users = await UserModel.find();
  
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
  
      const updatedUser = await UserModel.findByIdAndUpdate(idOfUserToUpdate, dataToUpdate, { new: true });
  
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
  
      const deletedUser = await UserModel.findByIdAndDelete(idOfUserToBeDeleted);
  
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
  checkUser,
  verifyToken,
  getUser,
  updateUser,
  deleteUser
}