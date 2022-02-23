import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.ObjectId, ref: "Client" },
  invoiceCode: String,
  invoiceTotal: {
    subtotal: Number,
    iva: Number,
  },
  invoiceStatus: String,
  invoice_at: { type: Date, default: Date.now },
  paid: Boolean,
  paid_at: String,
});

const invoice = mongoose.model("Invoice", invoiceSchema);

export default invoice;
