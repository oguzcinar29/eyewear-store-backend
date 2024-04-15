import mongoose, {
  Document,
  InferSchemaType,
  model,
  models,
  Schema,
} from "mongoose";
export interface ICard extends Document {
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

const productItemSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  description: { type: String, required: true },
  stock: { type: Number, default: 1 },
  discount: { type: Number, default: 0 },
  images: [{ type: String, required: true }],
  quantity: { type: Number },
});

export type ProductItemType = InferSchemaType<typeof productItemSchema>;

const CardSchema = new Schema(
  {
    product: [productItemSchema],
    auth: {
      guestId: { type: String },
      userId: { type: String },
    },
  },
  { timestamps: true }
);
const Card = models.Card || model<ICard>("Card", CardSchema);
export default Card;
