import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  let token = req.header("Autorización");
  if (!token)
    return res.status(400).send({ message: "Autorización denegada: sin token" });

  token = token.split(" ")[1];
  if (!token)
    return res.status(400).send({ message: "Autorización denegada: sin token" });

  try {
    req.user = jwt.verify(token, process.env.SK_JWT);
    next();
  } catch (e) {
    return res
      .status(400)
      .send({ message: "Autorización denegada: sin token" });
  }
};

export default auth;
