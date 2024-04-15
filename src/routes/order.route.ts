import express from "express";
import { createCheckoutSession } from "../controllers/order.controller";

const router = express.Router();

router.post("/checkout/create-checkout-session", createCheckoutSession);

export default router;
