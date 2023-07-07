const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("../model/user.model");
const { authMiddleware } = require("../middleware/auth.middleware");
require("dotenv").config();
// register

usersRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    // user exits already ?
    const userExists = await UserModel.findOne({ email });
    // console.log(userExists, '@user');
    if (userExists) {
      return res.send({
        success: false,
        message:
          "User already exists in the database. Try with fresh credentials",
      });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).send({
        message:
          "Password must contain at least 8 characters, including at least 1 number, 1 lowercase letter, and 1 uppercase letter.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = new UserModel({ ...req.body, password: hashedPass });
    await newUser.save();
    res.status(200).send({
      success: true,
      message: "user has been registered successfully",
    });
  } catch (err) {
    return res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

// login
usersRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await UserModel.findOne({ email });
    // console.log(userExists, "@user");

    // user exits already ?
    if (!userExists) {
      return res
        .status(401)
        .send({ success: false, message: "invalid username or password" });
    }
    // userType is matching
    if (userExists.userType !== req.body.userType) {
      return res.send({
        success: false,
        message: `User is not registered as ${req.body.userType}`,
      });
    }

    // comparing

    const validPassword = await bcrypt.compare(password, userExists.password);
    if (!validPassword) {
      return (
        res
          // .status(401)
          .send({ success: false, message: "Inavlid Password" })
      );
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
    res.status(200).send({
      success: true,
      message: "User logged in successfully",
      user: userExists,
      token: accessToken,
    });
    // console.log("@@", user, token);
  } catch (err) {
    // console.log("err.message", err.message);
    return res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

// getCurrentUSer
usersRouter.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    // 1. Descrypting JWT Token
    // 2. Getting info from MongoDb and sending to FE
    const isUser = await UserModel.findOne({ _id: req.body.userID });

    // Remove password from isUser object
    // isUser.password = undefined;
    if (isUser) {
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: isUser,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
});

// export

module.exports = { usersRouter };
