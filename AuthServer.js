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
// Endpoint for Add to Cart save data to MongoDB
app.post("/addtocart", auth, async (req, res) => {
  console.log("Added",req.body.itemId);
  let userData = await user.findOne({_id:req.user.id});
  userData.cartData[req.body.itemId] += 1;
  await user.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
  res.send("Added")

})
// Endpoint for Remove from Cart save data to MongoDB
app.post("/removetocart", auth, async (req, res) => {
  console.log("removed",req.body.itemId);
  let userData = await user.findOne({_id:req.user.id});
  if(userData.cartData[req.body.itemId]>0)
  userData.cartData[req.body.itemId] = 0;
  await user.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
  res.send("Removed")

})
// Enpoint to get Cartdata

app.post("/getcart", auth, async (req, res) => {
  console.log("GetCart");
  let userData = await user.findOne({_id:req.user.id});
  res.json(userData.cartData);

})
// Endpoint for Add to Cart save data to MongoDB
app.post("/updatecart", auth, async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    // Find the user by their ID
    let userData = await user.findOne({ _id: req.user.id });
    
    // Ensure cartData exists
    if (!userData.cartData) {
      return res.status(400).json({ message: "Cart data not found." });
    }

    // Check if the item exists in the cart
    if (!(itemId in userData.cartData)) {
      return res.status(404).json({ message: "Item not found in the cart." });
    }

    // Update the item's quantity in the cart
    userData.cartData[itemId] = quantity;

    // Save the updated cart data to the database
    await user.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });

    res.json({ message: "Cart updated successfully." });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server error. Unable to update cart." });
  }
});
app.get("/api/auth/protected", auth, (req, res) => {
  res.status(200).json({ message: "Token is valid", user: req.user });
});

// Server setup
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
