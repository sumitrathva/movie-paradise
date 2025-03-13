import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import "dotenv/config";
import routes from "./src/routes/index.js";

const app = express();

// ✅ CORS settings (adjust if needed)
app.use(cors({ origin: "*", credentials: true }));

// ✅ Ensure Express parses JSON properly
app.use(express.json()); 

// ❌ REMOVE: `express.urlencoded({ extended: false })` (not needed for JSON APIs)
app.use(cookieParser());

app.use("/api/v1", routes);

const port = process.env.PORT || 5000;
const server = http.createServer(app);

// ✅ Suppress Mongoose strictQuery warning
mongoose.set("strictQuery", false);

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Mongodb connected");
    server.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
