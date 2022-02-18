import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.ObjectId, ref: "clients" },
  invoiceCode: String,
  invoiceTotal: {
    subtotal: Number,
    iva: Number,
  },
  invoiceStatus: String,
  invoiceDate: { type: Date, default: Date.now },
  paid: Boolean,
  paidDate: String,
});

const invoice = mongoose.model("invoices", invoiceSchema);

export default invoice;
