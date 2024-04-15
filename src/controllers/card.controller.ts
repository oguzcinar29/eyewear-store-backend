import { Request, Response } from "express";
import { connectToDatabase } from "../database";
import Card from "../models/card";

export const addToCard = async (req: Request, res: Response) => {
  const { item, guestId } = req.body;

  try {
    await connectToDatabase();
    const card = await Card.findOne({ auth: { guestId } });
    if (!card) {
      const newItem = { ...item, quantity: 1 };
      const createdCard = await Card.create({
        product: newItem,
        auth: { guestId },
      });
      return res.status(201).json(createdCard.product);
    } else {
      const findProductIndex = card.product.findIndex((item2: any) => {
        return item2._id.toString() === item._id.toString();
      });

      if (findProductIndex === -1) {
        const newItem = { ...item, quantity: 1 };
        card.product.push(newItem);
        await Card.findOneAndReplace({ auth: { guestId } }, card);
        return res.status(200).json(card.product);
      } else {
        card.product[findProductIndex].quantity++;
        await Card.findOneAndReplace({ auth: { guestId } }, card);
        return res.status(200).json(card.product);
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error" });
  }
};

export const getCard = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
    await connectToDatabase();
    const card = await Card.findOne({ auth: { guestId: id } });
    return res.status(200).json(card.product);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error" });
  }
};

export const deleteCard = async (req: Request, res: Response) => {
  const { productId, guestId } = req.query;
  try {
    await connectToDatabase();
    const card = await Card.findOne({ auth: { guestId } });

    const findProductIndex = card.product.findIndex(
      (item: any) => item._id.toString() === productId?.toString()
    );

    card.product.splice(findProductIndex, 1);
    await Card.findOneAndReplace({ auth: { guestId } }, card);
    return res.status(200).json(card.product);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error" });
  }
};

export const changeQuantity = async (req: Request, res: Response) => {
  const { type, guestId, productId } = req.body;

  try {
    await connectToDatabase();
    const card = await Card.findOne({ auth: { guestId } });

    const findProductIndex = card.product.findIndex(
      (item: any) => item._id.toString() === productId.toString()
    );

    if (type === "inc") {
      card.product[findProductIndex].quantity++;
    }
    if (type === "dec") {
      if (card.product[findProductIndex].quantity !== 1) {
        card.product[findProductIndex].quantity--;
      }
    }
    await Card.findOneAndReplace({ auth: { guestId } }, card);
    return res.status(200).json(card.product);
  } catch (err) {
    console.log(err);
  }
};
