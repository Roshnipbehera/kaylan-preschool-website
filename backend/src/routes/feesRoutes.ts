import { Router } from "express";
import * as feesController from "../controllers/feesController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/invoices", requireAuth, feesController.listInvoices);
router.get("/payments", requireAuth, feesController.listPayments);
router.post("/invoices", requireAuth, requireRole("admin"), feesController.createInvoice);
router.patch("/invoices/:id", requireAuth, requireRole("admin"), feesController.updateInvoice);
router.delete("/invoices/:id", requireAuth, requireRole("admin"), feesController.deleteInvoice);
router.post("/payments", requireAuth, feesController.recordPayment);
router.post("/razorpay/create-order", requireAuth, feesController.createRazorpayOrder);
router.post("/razorpay/verify", requireAuth, feesController.verifyRazorpayPayment);

export default router;
