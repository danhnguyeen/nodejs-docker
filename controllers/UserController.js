const User = require("../models/User");

class UserController {
  static async index(req, res, next) {
    try {
      const users = await User.paginate();

      res.status(200).json({
        message: "GET users",
        users,
      });
    } catch (error) {
      console.log(error);
      console.log("error");
    }
  }

  static async findOne(req, res, next) {
    try {
      const user = await User.findById(req.params.id);

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      console.log("error");
    }
  }

  static async delete(req, res, next) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      console.log("error");
    }
  }
}

module.exports = UserController;
