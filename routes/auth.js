const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const user = await newUser.save();
    console.log(user);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});
