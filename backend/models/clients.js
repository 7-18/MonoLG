import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  city: String,
  address: {
    street: String,
    state: String,
    zip: Number,
  },
  nit: Number,
  dbStatus: Boolean,
  registeredAt: { type: Date, default: Date.now },
});

const client = mongoose.model("clients", clientSchema);
export default client;
