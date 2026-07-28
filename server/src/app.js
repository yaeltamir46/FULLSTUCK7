import express from "express";
import {env} from "./config/env.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is running");
});

const PORT = env.port || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});