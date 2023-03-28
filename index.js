import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import router from "./router/router.js";
import errorMiddleware from "./middlewares/error-middleware.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(json());
app.use(cookieParser());
app.use("/api", router);
app.use(errorMiddleware);
app.use("/uploads", express.static("uploads"));

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => console.log(`Сервер запущен на порте - ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
