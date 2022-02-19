import role from "../models/roles.js";

/* Only test, for more control of the app */
const REGISTER_ROLE = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send({ message: "Datos incompletos" });

  const existing_Role = await role.findOne({ name: req.body.name });
  if (existing_Role)
    return res.status(400).send({ message: "El rol ya existe" });

  const roleSchema = new role({
    name: req.body.name,
    description: req.body.description,
    dbStatus: true,
  });

  const $result = await roleSchema.save();
  return !$result
    ? res.status(400).send({ message: "Error al registrar rol" })
    : res.status(200).send({ $result });
};

const LIST_ROLE = async (req, res) => {
  const role_List = await role.find();
  return role_List.length == 0
    ? res.status(400).send({ message: "Lista de roles vacía" })
    : res.status(200).send({ role_List });
};

const FIND_ROLE = async (req, res) => {
  const roleId = await role.findById({ _id: req.params["_id"] });
  return !roleId
    ? res.status(400).send({ message: "No se encontraron resultados" })
    : res.status(200).send({ roleId });
};

const UPDATE_ROLE = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send({ message: "Datos incompletos" });

  const existing_Role = await role.findOne({
    name: req.body.name,
    description: req.body.description,
  });
  if (existing_Role)
    return res.status(400).send({ message: "El rol ya existe" });

  const role_Update = await role.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    description: req.body.description,
  });

  return !role_Update
    ? res.status(400).send({ message: "Error al guardar los cambios de rol" })
    : res.status(200).send({ message: "Rol actualizado" });
};

const DELETE_ROLE = async (req, res) => {
  const role_Delete = await role.findByIdAndDelete({ _id: req.params["_id"] });
  return !role_Delete
    ? res.status(400).send({ message: "Rol no encontrado" })
    : res.status(200).send({ message: "Rol eliminado" });
};

export default {
  REGISTER_ROLE,
  LIST_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
  FIND_ROLE,
};
