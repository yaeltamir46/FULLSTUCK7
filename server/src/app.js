import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { notFoundHandler } from "./middleware/notFound.middleware.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

//routes

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = env.port || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
