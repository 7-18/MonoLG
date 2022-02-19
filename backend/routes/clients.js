import express from "express";
import client from "../controllers/clients.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import validId from "../middlewares/validId.js";
const router = express.Router();

router.post("/registerClient", client.REGISTER_CLIENT);
router.post("/registerAdminClient", auth, admin, client.REGISTER_ADMIN_CLIENT);
router.post("/login", client.login);
router.get("/listClients/:name?", auth, admin, client.LIST_ALL_CLIENTS);
router.get("/getRole/:email", auth, client.GET_CLIENT_ROLE);
router.get("/findClient/:_id", auth, validId, admin, client.FIND_CLIENT);
router.put("/updateClient", auth, admin, client.UPDATE_CLIENT);
router.put("/deleteClient", auth, admin, client.DELETE_CLIENT);

export default router;
