import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  roleId: { type: mongoose.Schema.ObjectId, ref: "roles" },
  address: { country: String, city: String },
  nit: Number,
  dbStatus: Boolean,
  registerDate: { type: Date, default: Date.now },
});

const client = mongoose.model("clients", clientSchema);
export default client;
