import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import productRoute from "./routes/product.route";
import cardRoute from "./routes/card.route";
import bodyParser from "body-parser";
import orderRoute from "./routes/order.route";

const PORT = 7000;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/health", (req: Request, res: Response) => {
  res.send({ message: "Health OK!" });
});

app.use("/api/products", productRoute);
app.use("/api/card", cardRoute);
app.use("/api/order", orderRoute);

app.listen(PORT, () => {
  console.log(`The server listening on port ${PORT}`);
});
