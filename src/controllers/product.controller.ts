import { Request, Response } from "express";
import { connectToDatabase } from "../database";
import Product from "../models/product";

export const getProducts = async (req: Request, res: Response) => {
  const { sort } = req.query;

  try {
    await connectToDatabase();

    const products = await Product.find();

    if (!sort) {
      return res.status(200).send(products);
    }

    if (sort === "high") {
      for (let i = 0; i < products.length; i++) {
        for (let j = i + 1; j < products.length; j++) {
          if (products[i].price < products[j].price) {
            let temp = products[i];
            products[i] = products[j];
            products[j] = temp;
          }
        }
      }
    }
    if (sort === "low") {
      for (let i = 0; i < products.length; i++) {
        for (let j = i + 1; j < products.length; j++) {
          if (products[i].price > products[j].price) {
            let temp = products[i];
            products[i] = products[j];
            products[j] = temp;
          }
        }
      }
    }

    return res.status(200).send(products);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Oppsss! Something went wrong." });
  }
};

export const updateProduct = async (req: Request, res: Response) => {};

export const createProduct = async (req: Request, res: Response) => {
  try {
    await connectToDatabase();
    await Product.create({ ...req.body });
    return res.status(201).send({ message: "OK" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Oppsss! Something went wrong." });
  }
};
