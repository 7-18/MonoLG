import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.ObjectId, ref: "clients" },
  invoiceCode: Number,
  invoiceTotal: { subtotal: Number, iva: Number, total: Number },
  invoiceStatus: String,
  invoice_date: { type: Date, default: Date.now},
  paid: Boolean,
  paid_at: Date,
  createdAt: { type: Date, default: Date.now },
  user: {
    name: String,
    city: String,
    nit: String
  },
});

const invoice = mongoose.model("invoices", invoiceSchema);
export default invoice;
