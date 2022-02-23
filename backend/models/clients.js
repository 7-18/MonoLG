import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  address: { country: { type: String }, city: { type: String } },
  nit: Number,
  dbStatus: Boolean,
  registered_at: { type: Date, default: Date.now },
});

const client = mongoose.model("Client", clientSchema);
export default client;
