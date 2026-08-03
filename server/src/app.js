import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/notFound.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import usersRoutes from "./routes/users.routes.js";


const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

//routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/products", productsRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", ordersRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = env.port || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
