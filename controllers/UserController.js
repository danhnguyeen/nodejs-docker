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

  static async stats(req, res, next) {
    try {
      // const users = await User.aggregate([
      //   { $match: { username: { $regex: ".*" + req.query.username + ".*" }, isAdmin: false } },
      //   { $project: { month: {$month: "$createdAt"} }}
      // ]);
      // const users = await User.aggregate([
      //   // { $match: { username: { $regex: ".*" + req.query.username + ".*" }, isAdmin: false } },
      //   {
      //     $project: {
      //       created: "$createdAt",
      //       updatedMonth: { $month: "$updatedAt" },
      //       username: 1,
      //       email: 1,
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: "$updatedMonth",
      //       count: { $sum: 1 },
      //       "email": { "$first": "$email" },
      //       "username": { "$first": "$username" },
      //     },
      //   },
      // ]);
      const users = await User.where('username').regex(".*g.*");
      console.log(users);
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
