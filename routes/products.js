const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");

router.get("/", async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    message: "GET products",
    products,
  });
});

router.post("/", async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    // Start session
    await session.startTransaction();

    const product1 = new Product({
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    });
    const product2 = new Product({
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    });
    // return Customer.create([{ name: 'Test' }], { session: session })
    product1.save({ session });
    product2.save({ session });

    // finish transcation
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({
      message: "POST products",
      product1,
      product2,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
});

router.get("/:productId", async (req, res, next) => {
  const id = req.params.productId;
  try {
    const product = await Product.findById(id);
    res.status(200).json({
      product,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

router.patch("/:productId", async (req, res, next) => {
  const _id = req.params.productId;
  try {
    const product = await Product.findByIdAndUpdate(_id, { ...req.body });
    res.status(200).json({
      product,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

router.delete("/:productId", async (req, res, next) => {
  const _id = req.params.productId;
  try {
    const product = await Product.deleteOne({ _id });
    res.status(200).json({
      product,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
});

module.exports = router;
