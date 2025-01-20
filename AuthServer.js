const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const auth = require("./middlewares/auth");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { log } = require("console");
const user = require("./models/user");
const router = express.Router();

// Initialize express

const app = express();

dotenv.config();

app.use(cors());

// Middleware setup
app.use(express.json());
app.use(bodyParser.json());

// Use Routes
app.use("/auth", authRoutes); // Add auth routes

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Auth Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send(
    "AhsanAli-BSCS-F20-280,AbdullahRabi-BSCS-F20-316,WaleedJaved-BSCS-F20-337"
  );
});

app.get("/api/auth/protected", auth, (req, res) => {
  res.status(200).json({ message: "Token is valid", user: req.user });
});

// Server setup
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
