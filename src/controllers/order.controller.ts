import Stripe from "stripe";
import { Request, Response } from "express";
import Card, { ProductItemType } from "../models/card";
import { connectToDatabase } from "../database";
import Order from "../models/order";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL;

type CheckoutSessionRequest = {
  cartItems: {
    productItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    username: string;
    firstName: string;
    lastName: string;
    company: string;
    country: string;
    street: string;
    apartment: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    note: string;
  };
  guestId: string;
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;
    const guestId = checkoutSessionRequest.guestId;
    await connectToDatabase();
    const card = await Card.findOne({ auth: { guestId } });
    if (!card) {
      throw new Error("Card not found");
    }
    const getTotalPrice = () => {
      let total = 0;

      card.product.forEach((item: any) => {
        total += item.quantity * item.price;
      });
      return total;
    };
    const newOrder = new Order({
      cardId: card._id,
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      totalAmount: getTotalPrice(),
      createdAt: new Date(),
    });

    const total = getTotalPrice();
    const lineItems: any = createLineItems(
      checkoutSessionRequest,
      card.product
    );

    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      500,
      card._id.toString()
    );
    if (!session.url) {
      return res.status(500).json({ message: "Error creating stripe session" });
    }
    await newOrder.save();
    res.json({ url: session.url });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ message: err.raw.message });
  }
};

const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  products: ProductItemType[]
) => {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = products.find(
      (item) => item._id.toString() === cartItem.productItemId.toString()
    );
    if (!menuItem) {
      throw new Error("Menu item not found");
    }
    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "usd",
        unit_amount: menuItem.price * 100,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };
    return line_item;
  });
  return lineItems;
};

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  cardId: string
) => {
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryPrice,
            currency: "usd",
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      orderId,
      cardId,
    },
    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${cardId}?cancelled=true`,
  });
  return sessionData;
};
