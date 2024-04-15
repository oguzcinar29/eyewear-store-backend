import express from "express";
import {
  addToCard,
  changeQuantity,
  deleteCard,
  getCard,
} from "../controllers/card.controller";

const router = express.Router();

router.post("/add-to-card", addToCard);
router.get("/get-card", getCard);
router.delete("/delete-card", deleteCard);
router.patch("/change-quantity", changeQuantity);
export default router;
