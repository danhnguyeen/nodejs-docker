const User = require("../models/User");

class UserController {
  static async index(req, res, next) {
    try {
      const users = await User.find();

      res.status(200).json({
        message: "GET users",
        users,
      });
    } catch (error) {
      console.log(error);
      console.log("error");
    }
  }
}

module.exports = UserController;
