const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const {isAdmin} = require("../middleware/authenticate");

router.get("/", UserController.index);
router.get("/:id", UserController.findOne);
router.delete("/:id", isAdmin, UserController.delete);

module.exports = router;
