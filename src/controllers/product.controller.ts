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

export const getSingleProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await connectToDatabase();
    const product = await Product.findById(id);
    return res.status(200).json(product);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error" });
  }
};

export const getPrevNextProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await connectToDatabase();
    const products = await Product.find();
    const findProductIndex = products.findIndex(
      (item: any) => item._id.toString() === id
    );

    if (findProductIndex + 1 < products.length && findProductIndex - 1 >= 0) {
      return res.status(200).json({
        prevProduct: products[findProductIndex - 1],
        nextProduct: products[findProductIndex + 1],
      });
    } else {
      if (findProductIndex + 1 === products.length) {
        return res.status(200).json({
          prevProduct: products[findProductIndex - 1],
          nextProduct: products[0],
        });
      }
      if (findProductIndex - 1 < 0) {
        return res.status(200).json({
          prevProduct: products[products.length - 1],
          nextProduct: products[findProductIndex + 1],
        });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error" });
  }
};
