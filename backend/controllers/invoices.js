import invoice from "../models/invoices.js";

const SAVE_INVOICE = async (req, res) => {
  if (!req.body.invoiceCode || !req.body.subtotal || !req.body.iva)
    return res.status(400).send({ message: "Datos incompletos" });

  const invoiceSchema = new invoice({
    clientId: req.client._id,
    invoiceCode: req.body.invoiceCode,
    invoiceTotal: {
      subtotal: req.body.subtotal,
      iva: req.body.iva,
      total: req.body.subtotal + req.body.iva,
    },
    invoiceStatus: "primerrecordatorio",
    invoice_date: req.body.invoice_date,
    paid: false,
    paid_at: req.body.paid_at,
    user: {
      name: req.client.name,
      city: req.client.city,
      nit: req.client.nit,
    },
  });

  const $result = await invoiceSchema.save();
  return !$result
    ? res.status(400).send({ message: "Error al registrar la factura" })
    : res.status(200).send({ $result });
};

const LIST_INVOICE = async (req, res) => {
  const invoiceList = await invoice.find({ clientId: req.client._id });
  return invoiceList.length === 0
    ? res.status(400).send({ message: "No tienes ninguna factura" })
    : res.status(200).send({ invoiceList });
};

const UPDATE_INVOICE = async (req, res) => {
  if (!req.body._id || !req.body.invoiceStatus)
    return res.status(400).send({ message: "Datos incompletos" });

  const invoiceUpdate = await invoice.findByIdAndUpdate(req.body._id, {
    invoiceStatus: req.body.invoiceStatus,
  });

  return !invoiceUpdate
    ? res.status(400).send({ message: "Factura no encontrada" })
    : res.status(200).send({ message: "Factura actualizada" });
};

// const UPDATE_PAID = async (req, res) => {
//   if (!req.body._id || !req.body.paid)
//     return res.status(400).send({ message: "Pago no realizado" });

//   const paidUpdate = await invoice.findByIdAndUpdate(req.body._id, {
//     paidStatus: req.body.paid,
//   })

//   return !paidUpdate
//   ? res.status(400).send({ message: "Pago no realizado" })
//   : res.status(400).send({ message: "Factura actualizada" })
// }

const DELETE_INVOICE = async (req, res) => {
  const invoiceDelete = await invoice.findByIdAndDelete({
    _id: req.params["_id"],
  });
  if (!invoiceDelete)
    return res.status(400).send({ message: "Factura no encontrada" });
};

// const SEND_MAIL = async (req, res) => {
//   if(!req.body._id || !req.body.invoiceStatus)
//     return res.status(400).send({ message: "Error en el proceso" });

//   const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'alexandrea.labadie51@ethereal.email',
//         pass: '8pWDtCVehvcz2b1CaS'
//     }
// });

//   const receptor = await client.findOne({ email: req.body.email });
//   const receptor_2 = await invoice.find({ clientId: req.client._id });
//   if(!receptor || !receptor_2)
//   return res.status(400).send({ message: "Email no coincide" });

//   const mailOptions = await {
//     from: "Remitente",
//     to: req.body.email,
//     subject: "Enviado desde nodemailer",
//     text: "Hola tú"
//   }

//   transporter.sendMail(mailOptions, (err, info) => {
//     if(err) {
//       res.status(500).send(err.message)
//     } else {
//       console.log("Email enviado correctamente")
//       res.status(200).jsonp(req.body);
//     }
//   })
// }

export default { SAVE_INVOICE, LIST_INVOICE, UPDATE_INVOICE, DELETE_INVOICE };
