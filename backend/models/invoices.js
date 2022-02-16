import mongoose, { Schema } from "mongoose";

const invoiceSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.ObjectId, ref: "clients" },
  invoiceCode: String,
  invoiceTotal: {
    subTotal: Number,
    iva: Number,
  },
  invoiceStatus: String,
  invoiceDate: { type: Date },
  paid: Boolean,
  paidDate: { type: Date },
});

const invoice = mongoose.model("invoices", invoiceSchema);

export default invoice;
