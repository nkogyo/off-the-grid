const express = require("express");
const { db, admin } = require("../firebaseAdmin");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      message,
      source,
      productId,
      productName,
      brand,
      price,
      sizes,
    } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim();
    const trimmedMessage = String(message).trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (trimmedMessage.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 5 characters long.",
      });
    }

    const payload = {
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
      source: source || "contact-page",
      productId: productId || "",
      productName: productName || "",
      brand: brand || "",
      price: price || "",
      sizes: sizes || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const savedDoc = await db.collection("contactMessages").add(payload);

    return res.status(201).json({
      success: true,
      message: "Inquiry submitted successfully.",
      inquiryId: savedDoc.id,
    });
  } catch (error) {
    console.error("Error saving inquiry:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while submitting inquiry.",
    });
  }
});

module.exports = router;