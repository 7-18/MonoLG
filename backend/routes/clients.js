import express from "express";
import client from "../controllers/clients.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import validId from "../middlewares/validId.js";
const router = express.Router();

router.post("/registerClient", client.registerClient);
router.post("/registerAdminClient", auth, admin, client.registerAdminClient);
router.post("/login", client.login);
router.get("/listClients/:name?", auth, admin, client.listAllClient);
router.get("/getRole/:email", auth, client.getClientRole);
router.get("/findClient/:_id", auth, validId, admin, client.findClient);
router.put("/updateClient", auth, admin, client.updateClient);
router.put("/deleteClient", auth, admin, client.deleteClient);

export default router;
