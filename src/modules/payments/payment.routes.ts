import express from "express";
import { createPayment } from "./payment.service";
import { authMiddleware } from "../auth/auth.middleware";
import { isAdminMiddleware } from "../../middleware/auth.middleware";
import {
  allPayment,
  payment,
  paymentHistory,
  paymentNotification,
} from "./payment.controller";

const router = express.Router();

router.post("/", authMiddleware, payment);
router.post("/webhook", paymentNotification);
router.get("/history", authMiddleware, paymentHistory);
router.get("/admin/all", authMiddleware, isAdminMiddleware, allPayment);

export default router;
