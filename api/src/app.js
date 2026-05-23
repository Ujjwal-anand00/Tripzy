import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import itineraryRoutes from "./routes/itineraryRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware.js";

export const app = express();

app.use(
  cors({
    origin: env.corsOrigin === "*" ? true : env.corsOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Tripzy API is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/destinations", destinationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export const connectDatabase = async () => {
  await mongoose.connect(env.mongoUri);
  console.log("Connected to MongoDB");
};
