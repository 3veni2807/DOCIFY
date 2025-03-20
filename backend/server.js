import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRoutes.js"; // ✅ Import user routes
import documentRoutes from "./routes/DocumentRoutes.js"; // ✅ Import document routes

dotenv.config(); // ✅ Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Ensure MongoDB URI is set
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ ERROR: MONGO_URI is missing in .env file");
  process.exit(1);
}

// ✅ Ensure JWT Secret is set
const jwtSecret = process.env.JWT_SECRET; // Fixed variable name (was JWT_SECRET)
if (!jwtSecret) {
  console.error("❌ ERROR: JWT_SECRET_KEY is missing in .env file");
  process.exit(1);
}

// ✅ Connect to MongoDB (Fixed: Removed deprecated options)
mongoose.connect(mongoURI, { dbName: "Docify" })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// ✅ Use Routes
app.use("/api/users", userRoutes);
app.use("/api/documents", documentRoutes);

app.get("/check", (req, res) => {
  res.send("Check route is working!");
});


// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});