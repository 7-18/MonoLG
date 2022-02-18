import role from "../models/roles.js";

const admin = async (req, res, next) => {
  const adminRole = await role.findById(req.client.roleId);
  if (!adminRole) return res.status(400).send({ message: "Rol no encontrado" });

  return adminRole.name === "admin"
    ? next()
    : res.status(400).send({ message: "Usuario no autorizado" });
};

export default admin;
