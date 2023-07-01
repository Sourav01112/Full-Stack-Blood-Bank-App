const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("../model/user.model");
require("dotenv").config();
// register

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    // user exits already ?
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.json({
        success: false,
        message: "User already exists in the database try with new email",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = new UserModel({ ...req.body, password: hashedPass });
    await newUser.save();
    res.send({
      success: true,
      message: "user has been registered successfully",
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await UserModel.findOne({ email });

    // user exits already ?
    if (!userExists) {
      return res
        .status(401)
        .json({ success: false, message: "invalid username or password" });
    }

    // comparing

    const validPassword = await bcrypt.compare(password, userExists.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Inavlid Password" });
    }

    // Generating Token
    const accessToken = jwt.sign(
      {
        // _id: encrypting userID
        userID: userExists._id,
      },
      // secret key
      process.env.JWTSecret,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).json({
      success: true,
      msg: "User logged in successfully",
      user: userExists,
      token: accessToken,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

// export

module.exports = router;
