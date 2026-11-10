// Entry point. Express routing = our "API gateway"
import "dotenv/config";
import express from "express";
import cors from "cors";
import auth from "./modules/auth";
import products from "./modules/products";
import cart from "./modules/cart";
import orders from "./modules/orders";
const app = express();



app.use(cors());
app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/products", products);
app.use("/api/cart", cart);
app.use("/api/orders", orders);
app.listen(4000, () => console.log("API on http://localhost:4000"));
