import express from "express";
import {
  createProduct,
  deleteProduct,
  getPrevNextProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/product.controller";

const route = express.Router();

route.post("/create-product", createProduct);
route.get("/get-products", getProducts);
route.patch("/update-product", updateProduct);
route.get("/get-single-product/:id", getSingleProduct);
route.get("/get-prev-next-product/:id", getPrevNextProduct);
route.delete("delete-product/:id", deleteProduct);

export default route;
