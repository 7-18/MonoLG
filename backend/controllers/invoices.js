import invoice from "../models/invoices.js";
import moment from "moment";

const saveInvoice = async (req, res) => {
  if (!req.body.invoiceCode)
    return res.status(400).send({ message: "Incomplete data" });

  const invoiceSchema = new invoice({
    clientId: req.client._id,
    invoiceCode: req.body.invoiceCode,
    invoiceSubtotal: req.body.invoiceTotal.subtotal.Math.round(Math.random()),
    invoiceIva: req.body.invoiceTotal.iva.Math.round(Math.random()),
    invoiceTotal: req.body.invoiceTotal.subtotal + req.body.invoiceTotal.iva,
    invoiceStatus: "primer recordatorio",
    invoiceDate: req.body.invoiceDate,
    paid: false,
    paidDate: (req.body.paid = true.moment().locale("es").format("dddd MMM D")),
  });

  const result = await invoiceSchema.save();
  return !result
    ? res.status(400).send({ message: "Error al registrar la factura" })
    : res.status(200).send({ result });
};

const listInvoice = async (req, res) => {
  const invoiceList = await invoice.find({ clientId: req.client._id });
  return invoiceList.length === 0
    ? res.status(400).send({ message: "No tienes facturas registradas" })
    : res.status(200).send({ invoiceList });
};

const updateInvoice = async (req, res) => {
  if (!req.body._id || !req.body.invoiceStatus)
    return res.status(400).send({ message: "Datos incompletos" });

  const invoiceUpdate = await invoice.findByIdAndUpdate(req.body._id, {
    invoiceStatus: req.body.invoiceStatus,
  });

  return !invoiceUpdate
    ? res.status(400).send({ message: "Factura no encontrada" })
    : res.status(200).send({ message: "Factura actualizada" });
};

const deleteInvoice = async (req, res) => {
  const invoiceDelete = await invoice.findByIdAndDelete({
    _id: req.params["_id"],
  });
  if (!invoiceDelete)
    return res.status(400).send({ message: "Factura no encontrada" });
};

export default { saveInvoice, listInvoice, updateInvoice, deleteInvoice };
