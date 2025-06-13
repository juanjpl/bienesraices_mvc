import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/tokens.js";
import { emailRegistro } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    pagina: "Iniciar Sesión",
  });
};

const formularioRegistro = (req, res) => {

    //console.log(req.csrfToken())
    res.render("auth/registro", {
    pagina: "Crear Cuenta",
    csrfToken: req.csrfToken()
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
  });
};

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
  confirmar,
};
