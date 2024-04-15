import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";

const route = express.Router();

route.post("/create-product", createProduct);
route.get("/get-products", getProducts);
route.patch("/update-product", updateProduct);
export default route;
