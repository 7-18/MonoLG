import express from "express";
import invoice from "../controllers/invoices.js";
import auth from "../middlewares/auth.js";
import validId from "../middlewares/validId.js";
import multiparty from "connect-multiparty";
const mult = multiparty();
const router = express.Router();

router.post("/saveInvoice", auth, invoice.saveInvoice);
router.get("/listInvoice", auth, invoice.listInvoice);
router.put("/updateInvoice", auth, invoice.updateInvoice);
router.delete("/deleteInvoice/:_id", auth, validId, invoice.deleteInvoice);

export default router;
