const User = require("../models/User");
const jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");

class AuthController {
  static async register(req, res) {
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
      console.log(error);
      res.status(500).json(error);
    }
  }

  static async login(req, res) {
    try {
      const doc = await User.findByCredenticals(
        req.body.email,
        req.body.password
      );
      const token = jwt.sign(
        {
          id: doc._id,
          email: doc.email,
          isAdmin: doc.isAdmin,
        },
        process.env.JWT_KEY,
        { expiresIn: "1d" }
      );
      const user = jwt.decode(token, process.env.JWT_KEY);
      res.send({ token, user });
    } catch (error) {
      console.log(error);
      res.status(401).json(error);
    }
  }

  static async updateProfile(req, res) {
    try {
      const user = req.user;
      if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_PASSWORD_KEY).toString();
      }
      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      res.send(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(401).json(error);
    }
  }
}

module.exports = AuthController;
