const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (error, user) => {
      if (error) {
        res.status(401).json("Token is invalid");
      }
      req.user = user;
      req.token = token;
    });
    next();
  } catch (err) {
    res.status(401).send("You are not authenticated");
  }
};

const isAdmin = (req, res, next) => {
  isAuthenticated(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not allowed to access this action");
    }
  });
};

module.exports = { isAuthenticated, isAdmin };
