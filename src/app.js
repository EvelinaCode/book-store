import express from "express";
import bookRoutes from "./routes/bookRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import "dotenv/config";

const app = express();

app.use(express.json());

app.use("/api/books", bookRoutes);

app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
