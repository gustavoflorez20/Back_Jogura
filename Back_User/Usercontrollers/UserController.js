const UserModel = require('../UsertModels/UserModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mySalt=10;
const mySecret = 'BANANASECRETO'
const { Resend } = require('resend');

const addUser = async (req, res) => {
  try {
    console.log('Iniciando proceso de registro de usuario...');

    // Verificar si el usuario ya existe
    const existingUser = await UserModel.findOne({ email: req.body.email });

    if (existingUser) {
      console.log('Usuario ya existe.');
      return res.status(409).json({ msg: 'Usuario ya existe' });
    }

    const encryptedPassword = await bcrypt.hash(req.body.password, mySalt);

    console.log('Creando usuario en la base de datos...');
    UserModel.create({
      ...req.body,
      password: encryptedPassword,
    })
      .then((userDoc) => {
        console.log('Usuario creado exitosamente:', userDoc);

        const token = jwt.sign({ email: userDoc.email }, mySecret, { expiresIn: 60 });
        setTokenInServer(token);
        console.log('Token generado');

        res.status(200).json({ user: userDoc, token });
      })
      .catch((error) => {
        console.log('Error durante la creación del usuario:', error.code);

        switch (error.code) {
          default:
            res.status(400).json(error);
        }
      });
  } catch (error) {
    console.error('Error general durante la creación del usuario:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



let serverToken = '';

const setTokenInServer = (token) => {
  serverToken = token;
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
      const token = jwt.sign({ email: userFound.email }, mySecret, { expiresIn: 120 });
      setTokenInServer(token);

      console.log('Token . Usuario autenticado.');
      return res.status(200).json({ msg: 'Hola, estás logueado', token });
  }

  console.log('Contraseña incorrecta.');
  return res.status(404).json({ msg: 'Password no coincide' });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  console.log('token',)
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

  
  
  const resend = new Resend();

async function EmailUser(req, res) {
  
  if (serverToken) {
    console.log('Token encontrado. Enviando correo electrónico...');

    const emailOptions = {
      from: 'Tequetapas <tequetapas@resend.dev>',
      to: ['gustavoflorez20@gmail.com'], //email,
      subject: 'gmail',
      html: '<strong>Usuario Registrado</strong>',
    };

    try {
      const { data, error } = await resend.emails.send(emailOptions);
      if (error) {
        console.error({ error });
        res.status(500).json({ error: 'Error al enviar el correo electrónico' });
      } else {
        console.log('Correo electrónico enviado exitosamente.');
        res.status(200).json({ message: 'Correo electrónico enviado exitosamente.' });
      }
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else {
    console.log('Token no encontrado. No se enviará el correo electrónico.');
    res.status(404).json({ error: 'Token no encontrado. No se enviará el correo electrónico.' });
  }
}
  
async function sendEmailUser(req, res) {
  console.log('Enviando correo electrónico...');

  const emailOptions = {
    from: 'Tequetapas <tequetapas@resend.dev>',
    to: ['gustavoflorez20@gmail.com'], //email,
    subject: 'gmail',
    html: '<strong>Usuario Registrado</strong>',
  };

  try {
    const { data, error } = await resend.emails.send(emailOptions);
    if (error) {
      console.error({ error });
      res.status(500).json({ error: 'Error al enviar el correo electrónico' });
    } else {
      console.log('Correo electrónico enviado exitosamente.');
      res.status(200).json({ message: 'Correo electrónico enviado exitosamente.' });
    }
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

  
 
module.exports = {
  addUser,
  checkUser,
  verifyToken,
  getUser,
  updateUser,
  deleteUser,
  EmailUser,
  sendEmailUser
  
}