const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const mongoose = require("mongoose");

router.get("/", async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      message: "GET orders",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    });
    await order.save();
    res.status(201).json({
      message: "POST orders",
      order,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:orderId", async (req, res, next) => {
  const id = req.params.orderId;
  const order = await Order.findById(id).populate("product", "name");
  res.status(200).json({
    message: `Order  ${id}`,
    order,
  });
});

router.delete("/:orderId", async (req, res, next) => {
  const _id = req.params.orderId;
  try {
    const order = await Order.deleteOne({ _id });
    res.status(200).json({
      order,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});
module.exports = router;
