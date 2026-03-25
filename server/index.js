const express = require("express");
const cors = require("cors");
require("dotenv").config();

const inquiriesRoute = require("./routes/inquiries");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Off The Grid backend is running.",
  });
});

app.use("/api/inquiries", inquiriesRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});