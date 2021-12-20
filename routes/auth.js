const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const { isAuthenticated } = require("../middleware/authenticate");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.use(isAuthenticated);
router.put("/update-profile", AuthController.updateProfile);

module.exports = router;
