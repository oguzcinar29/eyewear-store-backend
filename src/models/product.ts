import { Document, model, models, Schema } from "mongoose";

export interface IProduct extends Document {
  _id: string;
  name: string;
  price: number;
  category: string;
  size: string;
  color: string;
  description: string;
  stock: number;
  discount: number;
  images: Array<string>;
}

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    description: { type: String, required: true },
    stock: { type: Number, default: 1 },
    discount: { type: Number, default: 0 },
    images: [{ type: String, required: true }],
  },
  { timestamps: true }
);
const Product = models.Product || model<IProduct>("Product", ProductSchema);
export default Product;
