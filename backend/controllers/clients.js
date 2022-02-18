import client from "../models/clients.js";
import role from "../models/roles.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";

const registerClient = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.address.country ||
    !req.body.address.city ||
    !req.body.nit
  )
    return res.status(400).send({ message: "Datos incompletos" });

  const existingClient = await client.findOne({ email: req.body.email });
  if (existingClient)
    return res
      .status(400)
      .send({ message: "El cliente ya ha sido registrado" });

  const passHash = await bcrypt.hash(req.body.password, 10);

  const roleId = await role.findOne({ name: "client" });
  if (!role)
    return res.status(400).send({ message: "No se ha asignado ningún rol" });

  const clientRegister = new client({
    name: req.body.name,
    email: req.body.email,
    password: passHash,
    roleId: roleId._id,
    address: { country: req.body.address.country, city: req.body.address.city },
    nit: req.body.nit,
    dbStatus: true,
  });

  const result = await clientRegister.save();

  try {
    return res.status(200).json({
      token: jwt.sign(
        {
          _id: result._id,
          name: result.name,
          roleId: result.roleId,
          iat: moment().unix(),
        },
        process.env.SK_JWT
      ),
    });
  } catch (e) {
    return res.status(400).send({ message: "Error al registrarse" });
  }
};

const registerAdminClient = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.roleId
  )
    return res.status(400).send({ message: "Datos incompletos" });

  const existingClient = await client.findOne({ email: req.body.email });
  if (existingClient)
    return res
      .status(400)
      .send({ message: "El cliente ya ha sido registrado" });

  const passHash = await bcrypt.hash(req.body.password, 10);

  const clientRegister = new client({
    name: req.body.name,
    email: req.body.email,
    password: passHash,
    roleId: req.body.roleId,
    dbStatus: true,
  });

  const result = await clientRegister.save();
  return !result
    ? res.status(400).send({ message: "Error al registrar al cliente" })
    : res.status(200).send({ result });
};

const listClients = async (req, res) => {
  const clientList = await client
    .find({
      $and: [
        { name: new RegExp(req.params["name"], "i") },
        { dbStatus: "true" },
      ],
    })
    .populate("roleId")
    .exec();
  return clientList.length === 0
    ? res.status(400).send({ message: "Lista de clientes vacía" })
    : res.status(200).send({ clientList });
};

const listAllClient = async (req, res) => {
  const clientList = await client
    .find({
      $and: [{ name: new RegExp(req.params["name"], "i") }],
    })
    .populate("roleId")
    .exec();
  return clientList.length === 0
    ? res.status(400).send({ message: "Lista de clientes vacía" })
    : res.status(200).send({ clientList });
};

const findClient = async (req, res) => {
  const clientfind = await client
    .findById({ _id: req.params["_id"] })
    .populate("roleId")
    .exec();
  return !clientfind
    ? res.status(400).send({ message: "No se encontraron resultados" })
    : res.status(200).send({ clientfind });
};

const getClientRole = async (req, res) => {
  let clientRole = await client
    .findOne({ email: req.params.email })
    .populate("roleId")
    .exec();
  if (clientRole.length === 0)
    return res.status(400).send({ message: "No se encontraron resultados" });

  clientRole = clientRole.roleId.name;
  return res.status(200).send({ clientRole });
};

const updateClient = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.roleId)
    return res.status(400).send({ message: "Datos incompletos" });

  const searchClient = await client.findById({ _id: req.body._id });
  if (req.body.email !== searchClient.email)
    return res.status(400).send({ message: "El email no puede ser cambiado" });

  let pass = "";

  if (req.body.password) {
    const passHash = await bcrypt.compare(
      req.body.password,
      searchClient.password
    );
    if (!passHash) {
      pass = await bcrypt.hash(req.body.password, 10);
    } else {
      pass = searchClient.password;
    }
  } else {
    pass = searchClient.password;
  }

  const existingClient = await client.findOne({
    name: req.body.name,
    email: req.body.email,
    password: pass,
    country: req.body.address.country,
    city: req.body.address.city,
    nit: req.body.nit,
    roleId: req.body.roleId,
  });
  if (existingClient)
    return res.status(400).send({ message: "No has realizado ningún cambio" });

  const clientUpdate = await client.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: pass,
    country: req.body.address.country,
    city: req.body.address.city,
    nit: req.body.nit,
    roleId: req.body.roleId,
  });

  return !clientUpdate
    ? res.status(400).send({ message: "Error a guardar los cambios" })
    : res.status(200).send({ message: "Cliente actualizado" });
};

const deleteClient = async (req, res) => {
  if (!req.body._id) return res.status(400).send("Datos incompletos");

  const clientDelete = await client.findByIdAndUpdate(req.body._id, {
    dbStatus: false,
  });
  return !clientDelete
    ? res.status(400).send({ message: "Cliente no encontrado" })
    : res.status(200).send({ message: "Cliente eliminado" });
};

const login = async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send({ message: "Datos incompletos" });

  const clientLogin = await client.findOne({ email: req.body.email });
  if (!clientLogin)
    return res.status(400).send({ message: "Email o contraseña no coinciden" });

  const hash = await bcrypt.compare(req.body.password, clientLogin.password);
  if (!hash)
    return res.status(400).send({ message: "Email o contraseña no coinciden" });

  try {
    return res.status(200).json({
      token: jwt.sign(
        {
          _id: clientLogin._id,
          name: clientLogin.name,
          roleId: clientLogin.roleId,
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
  registerClient,
  registerAdminClient,
  listClients,
  listAllClient,
  findClient,
  updateClient,
  deleteClient,
  login,
  getClientRole,
};
