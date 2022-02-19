import invoice from "../models/invoices.js";
import moment from "moment";

const SAVE_INVOICE = async (req, res) => {
  if (!req.body.invoiceCode)
    return res.status(400).send({ message: "Datos incompletos" });

  const invoiceSchema = new invoice({
    clientId: req.client._id,
    invoiceCode: req.body.invoiceCode,
    invoiceTotal: {
      invoiceSubtotal: req.body.invoiceTotal.subtotal.Math.round(Math.random()),
      invoiceIva: req.body.invoiceTotal.iva.Math.round(Math.random()),
    },
    invoiceStatus: "primer recordatorio",
    invoiceDate: req.body.invoiceDate,
    paid: false,
    paidDate: (req.body.paid = true
      ? moment().locale("es").format("dddd MMM D")
      : false),
  });

  const $result = await invoiceSchema.save();
  return !$result
    ? res.status(400).send({ message: "Error al registrar la factura" })
    : res.status(200).send({ $result });
};

const LIST_INVOICE = async (req, res) => {
  const invoice_List = await invoice.find({ clientId: req.client._id });
  return invoice_List.length === 0
    ? res.status(400).send({ message: "No tienes facturas registradas" })
    : res.status(200).send({ invoice_List });
};

const UPDATE_INVOICE = async (req, res) => {
  if (!req.body._id || !req.body.invoiceStatus)
    return res.status(400).send({ message: "Datos incompletos" });

  const invoice_Update = await invoice.findByIdAndUpdate(req.body._id, {
    invoiceStatus: req.body.invoiceStatus,
  });

  return !invoice_Update
    ? res.status(400).send({ message: "Factura no encontrada" })
    : res.status(200).send({ message: "Factura actualizada" });
};

const DELETE_INVOICE = async (req, res) => {
  const invoice_Delete = await invoice.findByIdAndDelete({
    _id: req.params["_id"],
  });
  if (!invoice_Delete)
    return res.status(400).send({ message: "Factura no encontrada" });
};

export default { SAVE_INVOICE, LIST_INVOICE, UPDATE_INVOICE, DELETE_INVOICE };
