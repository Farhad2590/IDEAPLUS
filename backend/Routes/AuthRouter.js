const {
  signup,
  signin,
  getUserById,
} = require("../Controllers/AuthController");
const {
  signupValidation,
  signinValidation,
} = require("../Middlewares/AuthValidation");
const ensureAuthenticated = require("../Middlewares/Auth");


const router = require("express").Router();

router.post("/signin", signinValidation, signin);

router.post("/signup", signupValidation, signup);

router.get("/user/:id", ensureAuthenticated, getUserById);

module.exports = router;
