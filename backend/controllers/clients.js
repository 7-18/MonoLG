import client from "../models/clients.js";
import role from "../models/roles.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";

const REGISTER_CLIENT = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.country ||
    !req.body.city ||
    !req.body.nit
  )
    return res.status(400).send({ message: "Datos incompletos" });

  const existing_Client = await client.findOne({ email: req.body.email });
  if (existing_Client)
    return res
      .status(400)
      .send({ message: "El cliente ya ha sido registrado" });

  const passHash = await bcrypt.hash(req.body.password, 10);

  const roleId = await role.findOne({ name: "client" });
  if (!role)
    return res.status(400).send({ message: "No se ha asignado ningún rol" });

  const client_Register = new client({
    name: req.body.name,
    email: req.body.email,
    password: passHash,
    roleId: roleId._id,
    address: { country: req.body.country, city: req.body.city },
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
          roleId: $result.roleId,
          iat: moment().unix(),
        },
        process.env.SK_JWT
      ),
    });
  } catch (e) {
    return res.status(400).send({ message: "Error al registrarse" });
  }
};

const REGISTER_ADMIN_CLIENT = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.country ||
    !req.body.city ||
    !req.body.nit ||
    !req.body.roleId
  )
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
    roleId: roleId._id,
    address: { country: req.body.country, city: req.body.city },
    nit: req.body.nit,
    dbStatus: true,
  });

  const $result = await client_Register.save();
  return !$result
    ? res.status(400).send({ message: "Error al registrar al cliente" })
    : res.status(200).send({ $result });
};

const LIST_CLIENTS = async (req, res) => {
  const client_List = await client
    .find({
      $and: [
        { name: new RegExp(req.params["name"], "i") },
        { dbStatus: "true" },
      ],
    })
    .populate("roleId")
    .exec();
  return client_List.length === 0
    ? res.status(400).send({ message: "Lista de clientes vacía" })
    : res.status(200).send({ client_List });
};

const LIST_ALL_CLIENTS = async (req, res) => {
  const client_List = await client
    .find({
      $and: [{ name: new RegExp(req.params["name"], "i") }],
    })
    .populate("roleId")
    .exec();
  return client_List.length === 0
    ? res.status(400).send({ message: "Lista de clientes vacía" })
    : res.status(200).send({ client_List });
};

const FIND_CLIENT = async (req, res) => {
  const client_find = await client
    .findById({ _id: req.params["_id"] })
    .populate("roleId")
    .exec();
  return !client_find
    ? res.status(400).send({ message: "No se encontraron resultados" })
    : res.status(200).send({ client_find });
};

const GET_CLIENT_ROLE = async (req, res) => {
  let client_Role = await client
    .findOne({ email: req.params.email })
    .populate("roleId")
    .exec();
  if (client_Role.length === 0)
    return res.status(400).send({ message: "No se encontraron resultados" });

  client_Role = client_Role.roleId.name;
  return res.status(200).send({ client_Role });
};

const UPDATE_CLIENT = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.roleId)
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
    country: req.body.country,
    city: req.body.city,
    nit: req.body.nit,
    roleId: req.body.roleId,
  });
  if (existing_Client)
    return res.status(400).send({ message: "No has realizado ningún cambio" });

  const client_Update = await client.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: pass,
    country: req.body.country,
    city: req.body.city,
    nit: req.body.nit,
    roleId: req.body.roleId,
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
          roleId: client_Login.roleId,
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
  REGISTER_ADMIN_CLIENT,
  LIST_CLIENTS,
  LIST_ALL_CLIENTS,
  FIND_CLIENT,
  GET_CLIENT_ROLE,
  UPDATE_CLIENT,
  DELETE_CLIENT,
  login,
};
