import client from "../models/clients.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";

const REGISTER_CLIENT = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password || !req.body.nit)
    return res.status(400).send({ message: "Datos incompletos" });

  const existing_Client = await client.findOne({ email: req.body.email });
  if (existing_Client)
    return res
      .status(400)
      .send({ message: "El cliente ya ha sido registrado" });

  const passHash = await bcrypt.hash(req.body.password, 10);

  const client_Register = new client({
    name: req.body.name,
    email: req.body.email,
    password: passHash,
    city: req.body.city,
    address: {
      street: req.body.street,
      state: req.body.state,
      zip: req.body.zip,
    },
    nit: req.body.nit,
    dbStatus: true,
  });

  const $result = await client_Register.save();

  try {
    return res.status(200).json({
      token: jwt.sign(
        {
          _id: $result._id,
          name: $result.name,
          city: $result.city,
          nit: $result.nit,
          iat: moment().unix(),
        },
        process.env.SK_JWT
      ),
    });
  } catch (e) {
    return res.status(400).send({ message: "Error al registrarse" });
  }
};

const UPDATE_CLIENT = async (req, res) => {
  if (!req.body.name || !req.body.email)
    return res.status(400).send({ message: "Datos incompletos" });

  const search_Client = await client.findById({ _id: req.body._id });
  if (req.body.email !== search_Client.email)
    return res.status(400).send({ message: "El email no puede ser cambiado" });

  let pass = "";

  if (req.body.password) {
    const passHash = await bcrypt.compare(
      req.body.password,
      search_Client.password
    );
    if (!passHash) {
      pass = await bcrypt.hash(req.body.password, 10);
    } else {
      pass = search_Client.password;
    }
  } else {
    pass = search_Client.password;
  }

  const existing_Client = await client.findOne({
    name: req.body.name,
    email: req.body.email,
    password: pass,
    city: req.body.city,
    address: {
      street: req.body.street,
      state: req.body.state,
      zip: req.body.zip,
    },
    nit: req.body.nit,
  });
  if (existing_Client)
    return res.status(400).send({ message: "No has realizado ningún cambio" });

  const client_Update = await client.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: pass,
    city: req.body.city,
    address: {
      street: req.body.street,
      state: req.body.state,
      zip: req.body.zip,
    },
    nit: req.body.nit,
  });

  return !client_Update
    ? res.status(400).send({ message: "Error a guardar los cambios" })
    : res.status(200).send({ message: "Cliente actualizado" });
};

const DELETE_CLIENT = async (req, res) => {
  if (!req.body._id) return res.status(400).send("Datos incompletos");

  const client_Delete = await client.findByIdAndUpdate(req.body._id, {
    dbStatus: false,
  });
  return !client_Delete
    ? res.status(400).send({ message: "Cliente no encontrado" })
    : res.status(200).send({ message: "Cliente eliminado" });
};

const login = async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "Datos incompletos" });

  const client_Login = await client.findOne({ email: req.body.email });
  if (!client_Login)
    return res.status(400).send({ message: "Email o contraseña no coinciden" });

  const hash = await bcrypt.compare(req.body.password, client_Login.password);
  if (!hash)
    return res.status(400).send({ message: "Email o contraseña no coinciden" });

  try {
    return res.status(200).json({
      token: jwt.sign(
        {
          _id: client_Login._id,
          name: client_Login.name,
          city: client_Login.city,
          nit: client_Login.nit,
          iat: moment().unix(),
        },
        process.env.SK_JWT
      ),
    });
  } catch (e) {
    return res.status(400).send({ message: "Error al iniciar sesión" });
  }
};

export default {
  REGISTER_CLIENT,
  UPDATE_CLIENT,
  DELETE_CLIENT,
  login,
};
