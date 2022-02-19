import express from "express";
import role from "../controllers/roles.js";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import validId from "../middlewares/validId.js";
const router = express.Router();

router.post("/registerRole", auth, admin, role.REGISTER_ROLE);
router.get("/listRole", auth, admin, role.LIST_ROLE);
router.get("/findRole/:_id", auth, validId, admin, role.FIND_ROLE);
router.put("/updateRole", auth, admin, role.UPDATE_ROLE);
router.delete("/deleteRole/:_id", auth, validId, admin, role.DELETE_ROLE);

export default router;
