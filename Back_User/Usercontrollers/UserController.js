const UserModel = require('../UsertModels/UserModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mySalt=10;
const mySecret = 'BANANASECRETO'
const { Resend } = require('resend');
const nodeMailer = require('nodemailer');


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


const transporter = nodeMailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'gustavoflorez20@gmail.com',
    pass: 'qtlptiqiehcgycrr',
  },
});


const buildMailOptions = (req) => {
  return {
    from: 'gustavoflorez20@gmail.com',
    to: req.body.email, 
    cc: 'gustavoflorez20@gmail.com', 
    subject: 'Registro Exitoso',
    html: '<strong>Bienvenido, tu registro ha sido exitoso</strong>',
  };
};

const EmailUsers = async (req, res) => {
  try {
    
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];

      
      const isValidToken = true;

      if (isValidToken) {
        console.log(`Enviando correo electrónico a ${req.body.email}...`);

        
        const mailOptions = buildMailOptions(req);

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error al enviar el correo electrónico:', error);
            res.status(500).json({ error: 'Error al enviar el correo electrónico' });
          } else {
            console.log('Correo electrónico enviado exitosamente a:', req.body.email);
            res.status(200).json({ message: 'Correo electrónico enviado exitosamente.' });
          }
        });
      } else {
        console.error('Token no válido o expirado.');
        res.status(401).json({ error: 'Token no válido o expirado' });
      }
    } else {
      
      console.error('Encabezado de autorización no encontrado en la solicitud.');
      res.status(400).json({ error: 'Encabezado de autorización no encontrado en la solicitud.' });
    }
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error.message);

    switch (error.code) {
      default:
        res.status(400).json(error);
    }
  }
};





const buildMailOptionss = (req) => {
  return {
    from: 'gustavoflorez20@gmail.com',
    to: req.body.email,
    cc: 'gustavoflorez20@gmail.com',
    subject: 'Restablecer Contraseña',
    html: '<strong>Pincha aqui para Restablecer http://localhost:5173/miPerfil </strong>',
  };
};

const sendEmailUsers = async (req, res) => {
  try {

    const user = await UserModel.findOne({ email: req.body.email });
    console.log ('Buscando Correo')

    if (!user) {
      console.error('Correo no encontrado en la base de datos.');
      return res.status(404).json({ error: 'Correo no encontrado en la base de datos.' });
    }

    if (req.headers) {
      console.log(`Enviando correo electrónico a ${req.body.email}...`);

      const mailOptions = buildMailOptionss(req);

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo electrónico:', error);
          res.status(500).json({ error: 'Error al enviar el correo electrónico' });
        } else {
          console.log('Correo electrónico enviado exitosamente a:', req.body.email);
          res.status(200).json({ message: 'Correo electrónico enviado exitosamente.' });
        }
      });
    } else {
      console.error('Encabezado de autorización no encontrado en la solicitud.');
      res.status(400).json({ error: 'Encabezado de autorización no encontrado en la solicitud.' });
    }
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error.message);

    switch (error.code) {
      default:
        res.status(400).json(error);
    }
  }
};


   




  
 
module.exports = {
  addUser,
  checkUser,
  verifyToken,
  getUser,
  updateUser,
  deleteUser,
  EmailUsers,
  sendEmailUsers
  
  
}