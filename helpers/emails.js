import nodemailer from "nodemailer";

const emailRegistro = async(datos)=>{
// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const {email, nombre, token } = datos

//Enviar el email
await transport.sendMail({
    from : "BienesRaices.com",
    to: email,
    suject:"Confirma tu Cuenta en BienesRaices.com",
    text:"Confirma tu Cuenta en BienesRaices.com",
    html:`
            <p>Hola ${nombre}, comprueba tu cuenta en bienesRaices.com</p>
            <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace:</p>
            <a href="${process.env.BACKEND_URL ?? 3000}/auth/confirmar/${token}" >Confirmar Cuenta</a>

            
            <p>Si tu no creaste esta cuetna, puedes ignorar el mensaje</p>
    `
})
}

export {
    emailRegistro 
}