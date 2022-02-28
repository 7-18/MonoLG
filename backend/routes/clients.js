import express from "express";
import client from "../controllers/clients.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

router.post("/registerClient", client.REGISTER_CLIENT);
router.post("/login", client.login);
router.put("/updateClient", auth, client.UPDATE_CLIENT);

export default router;
