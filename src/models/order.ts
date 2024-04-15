import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema({
  cardId: { type: Schema.Types.ObjectId, ref: "Card" },
  deliveryDetails: {
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: { type: String },
    country: { type: String, required: true },
    street: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    phone: { type: String, required: true },
    note: { type: String },
  },
  cartItems: [
    {
      productItemId: { type: String, required: true },
      quantity: { type: Number, required: true },
      name: { type: String, required: true },
    },
  ],
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now },
});

const Order = models.Order || model("Order", OrderSchema);
export default Order;
