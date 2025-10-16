const nodemailer = require('nodemailer')

//- Especifica el servicio que servirá como proveedor de correo electronico
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth:{
    user: "meetthemonsterr@gmail.com",
    pass: "zudxujiyqhakfkpr"
  }
});

const send = async (nombre, monto, descripcion) => {
  const mailOptions = {
    from: "meetthemonsterr@gmail.com",
    to: ["meetthemonsterr@gmail.com"], //.concat(correos)
    subject: `${nombre} ha agregado un nuevo gasto!`,
    html: `<h2>Anuncio: ${nombre} ha realizado un gasto de: $${monto} en ${descripcion}</h2>`
  }
  await transporter.sendMail(mailOptions)
};

module.exports = send
