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

    const userExists = await UserModel.findOne({ email });
    // console.log(userExists, '@user');
    if (userExists) {
      return res.send({
        success: false,
        message:
          "User already exists in the database. Try with fresh credentials",
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
  console.log("inside login", req.body)
  try {
    const { email, password } = req.body;
    const userExists = await UserModel.findOne({ email })
    // .select('password')
    console.log(userExists, "@user");

    // user exits already ?
    if (!userExists || userExists == null) {
      console.log("here-->")

      return res
        .status(401)
        .send({ success: false, message: "Invalid username or password" });
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

    const user = { ...userExists.toObject() };
    // console.log("user>>", user)
    delete user.password;

    res.status(200).send({
      success: true,
      message: "User logged in successfully",
      user: user,
      token: accessToken,
    });
    // console.log("@@", user, token);
  } catch (err) {
    console.log("err.message", err);
    return res.status(400).send({
      success: false,
      message: err.message,
    });
  }
});

// Get Current User According to UserType
usersRouter.get("/get-current-user",authMiddleware, async (req, res) => {
  console.log("inside---->, /get-current-user", req.body)

  try {
    const isUser = await UserModel.findOne({ _id: req.body.userID });
    const user = { ...isUser.toObject() };
    // console.log("user>>", user)
    delete user.password;
    if (isUser) {
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
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


usersRouter.post('/get-all-donors', authMiddleware, async(req,res)=>{
  try {


















    
    
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
})





// export
module.exports = { usersRouter };
