import express from "express";
import invoice from "../controllers/invoices.js";
import auth from "../middlewares/auth.js";
import validId from "../middlewares/validId.js";
const router = express.Router();

router.post("/saveInvoice", auth, invoice.SAVE_INVOICE);
router.get("/listInvoice", auth, invoice.LIST_INVOICE);
router.put("/updateInvoice", auth, invoice.UPDATE_INVOICE);
router.delete("/deleteInvoice/:_id", auth, validId, invoice.DELETE_INVOICE);

export default router;
