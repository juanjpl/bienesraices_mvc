import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt"
import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/tokens.js";
import { emailOlvidePassword, emailRegistro } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
  });
};

const formularioRegistro = (req, res) => {
  //console.log(req.csrfToken())
  res.render("auth/registro", {
    pagina: "Crear Cuenta",
    csrfToken: req.csrfToken(),
  });
};

const registrar = async (req, res) => {
  //console.log(req.body);
  //Validación
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre no puede ir vacío")
    .run(req);
  await check("email")
    .isEmail()
    .withMessage("Debe ingresar un email válido")
    .run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe tener minimo 6 caracteres")
    .run(req);
  await check("repetir_password")
    .equals("password")
    .withMessage("Los passwords no son iguales")
    .run(req);

  let resultado = validationResult(req);

  //return res.json(resulatdo.array())

  //verificar que el resultado esté vacio

  if (!resultado.isEmpty()) {
    //Errores
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  // Extraer los datos
  const { nombre, email, password } = req.body;

  //Verificar que el usuario no existe

  const existeUsuario = await Usuario.findOne({ where: { email: email } });
  //console.log(existeUsuario);

  if (existeUsuario) {
    return res.render("auth/registro", {
      pagina: "Crear Cuenta",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario ya está registrado" }],
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }
  //return existeUsuario;
  //res.json(resultado.array())
  //const usuario = await Usuario.create(req.body)
  //res.json(usuario);

  // Almacenar un Usuario

  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId(),
  });

  // Envia email de confirmacion

  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });

  //Mostrar mensaje de confirmacion
  res.render("templates/mensaje", {
    pagina: "Cuenta Creada Correctamente",
    mensaje: "Hemos Enviado un Emai de Confirmacion, presiona en el enlace.",
  });
};

// Funcion que comprueba una cuenta
const confirmar = async (req, res) => {
  const { token } = req.params;
  console.log(token);

  // Verificar si el token es valido
  const usuario = await Usuario.finOne({ where: { token } });

  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Error al confirmar la cuenta",
      mensaje:
        "Hubo un error al confirmar la cuenta. Intenta confirmar nuevamente.",
      error: true,
    });
  }
  //console.log(usuario);

  //confirmar la cuenta
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();

  return res.render("auth/confirmar-cuenta", {
    pagina: "Cuenta Confirmada",
    mensaje: "La cuenta se confirmó Correctamente",
  });
};

const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    pagina: "Recupera tu acceso a Bienes Raices",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req,res)=>{
//Validación
  await check("email")
    .isEmail()
    .withMessage("Debe ingresar un email válido")
    .run(req);
  

  let resultado = validationResult(req);

   if (!resultado.isEmpty()) {
    return res.render("auth/olvide-password", {
      pagina: "Recupera tu acceso a Bienes Raices",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
     
    });
  }

  //Buscar el usuario
  const {email} = req.body
  const usuario = await Usuario.findOne({where:{email}})

  if(!usuario){
    return res.render("auth/olvide-password", {
      pagina: "Recupera tu acceso a Bienes Raices",
      csrfToken: req.csrfToken(),
      errores: [{msg: "El email no Pertenece a ningun usuario"}],
     
    });
  }

  //Generar un token y enviar el email
usuario.token = generarId();
await usuario.save();

//Enviar un email
emailOlvidePassword({
  email: usuario.email,
  nombre: usuario.nombre,
  token:usuario.token

})

//Mostrar un mensaje de confirmacion
res.render("template/mensajes",{
  pagina:"Reestablece tu password",
  mensaje:"Hemos enviado un email con instrucciones."
})
}

const comprobarToken = async(req,res)=>{
const {token} = req.params;

const usuario = await Usuario.finOne({where:{token}});

console.log(usuario);

if(!usuario){
  return res.render("auth/confirmar-cuenta", {
      pagina: "Reestablece tu password",
      mensaje: "Hubo un error al validar tu información",
      errores: true,
     
    });
}

//Mostrar formulario para modificar el password
res.render("auth/reset-password"),{
  pagina:"Reestablece tu password",
  csrfToken: req.csrfToken()
}
}

const nuevoPassword =async(req,res)=>{
//validar el password
 await check("password").isLength({min:6}).withMessage("El password debe ser de al menos 6 caracteres").run(req)

 let resultado = validationResult(req)

 //Verificar que el resultado esta vilidado

 if(!resultado.isEmpty()){
  //Errores
  return res.render("auth/reset-password"),{
    pagina: "Reestablece tu Password",
    csrfToken: req.csrfToken(),
    errores: resultado.array()
  }
 }

 const {token} = req.params;
 const {password} = req.body; 

//Identificar el nuevo password
const usuario = await Usuario.finOne({where:{token}});


//Hashear el password
const salt = await bcrypt.genSalt(10)
usuario.password = await bcrypt.hash(usuario.password, salt);
usuario.token = null;

await usuario.save();

res.render("auth/confirmar-cuenta",{
  pagina: "Password reestablecido",
  mensaje:"El Password se guardó correctamente"
}


)

}


export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
  confirmar,
  resetPassword,
  comprobarToken,
  nuevoPassword

};
