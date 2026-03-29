// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const Notification = require("../models/notificationModel");

// GET all notifications for logged in user
router.get("/", protect, async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate("message")
    .populate("chat")
    .populate("recipient");
  res.json(notifications);
});

// DELETE a notification when user clicks it
router.delete("/:id", protect, async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ message: "Notification removed" });
});

module.exports = router;