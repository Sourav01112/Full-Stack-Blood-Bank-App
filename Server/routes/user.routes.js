const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { authMiddleware } = require("../middleware/auth.middleware");
const UserModel = require("../model/user.model");
const InventoryModel = require("../model/inventory.model");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const { handleResponse } = require("../utils/helper");

require("dotenv").config();


// register]
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
        .send({ status: 401, success: false, message: "Invalid username or password" });
    }
    // userType is matching
    if (userExists.userType !== req.body.userType) {
      return res.send({
        success: false,
        status: 203,
        message: `User is not registered as ${req.body.userType}`,
      });
    }

    // comparing

    const validPassword = await bcrypt.compare(password, userExists.password);
    if (!validPassword) {
      return (
        res
          // .status(401)
          .send({ status: 404, success: false, message: "Wrong Password Entered" })
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
usersRouter.get("/get-current-user", authMiddleware, async (req, res) => {
  // console.log("inside---->, /get-current-user", req.body)

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
    console.log("error in get-current-user", error)
    return res.json({
      success: false,
      message: error.message,
    });
  }
});

// Get All Unique Donor from the organization
usersRouter.post('/get-all-donors', authMiddleware, async (req, res) => {
  const page = parseInt(req.body.page, 10)
  const limit = parseInt(req.body.limit, 10)
  const skip = (page - 1) * limit

  const options = {
    page,
    limit,
    collation: {
      locale: 'en',
      strength: 2,
    },
    sort: { createdAt: -1 }

  };
  console.log("options", options)
  try {
    // Get all unique donors ids from Inventory if it matches the Org. then show unique donors
    const organization = new mongoose.Types.ObjectId(req.body.userID);

    const aggregationPipelineResult = await InventoryModel.aggregate([
      {
        $match: {
          inventoryType: 'Incoming',
          organization,
        },
      },
      {
        $group: {
          _id: "$donor",
        },
      },
    ]).exec();
    const populateKeyword = 'users'

    const aggregationResult = await performPopulateAfterAggregationPipeline(aggregationPipelineResult, populateKeyword)
    const response = formAggregateResponse(aggregationResult, options)

    return res.json({
      success: true,
      message: "Donors Data Fetched Successfully",
      data: response,
    })
  } catch (error) {

    console.log("error", error)
    return res.json({
      success: false,
      message: error.message,
    });
  }
})

// Get All Unique Hospitals from the organization
usersRouter.post('/get-all-hospitals', authMiddleware, async (req, res) => {
  const page = parseInt(req.body.page, 10)
  const limit = parseInt(req.body.limit, 10)
  const skip = (page - 1) * limit

  const options = {
    page,
    limit,
    collation: {
      locale: 'en',
      strength: 2,
    },
    sort: { createdAt: -1 }
  };
  try {
    // Get all unique donors ids from Inventory if it matches the Org. then show unique donors
    const organization = new mongoose.Types.ObjectId(req.body.userID);

    const aggregationPipelineResult = await InventoryModel.aggregate([
      {
        $match: {
          inventoryType: 'Outgoing',
          organization,
        },
      },
      {
        $group: {
          _id: "$hospital",
        },
      },
    ]).exec();
    const populateKeyword = 'users'

    const aggregationResult = await performPopulateAfterAggregationPipeline(aggregationPipelineResult, populateKeyword)
    const response = formAggregateResponse(aggregationResult, options)

    return res.json({
      success: true,
      message: "Hospital Data Fetched Successfully",
      data: response,
    })
  } catch (error) {

    console.log("error", error)
    return res.json({
      success: false,
      message: error.message,
    });
  }
})


// Get All Unique Organizations for Donor View
// This retrieves a list of all the organizations to which an individual like me has contributed blood donations.
usersRouter.post('/get-all-org-for-donor', authMiddleware, async (req, res) => {
  const page = parseInt(req.body.page, 10)
  const limit = parseInt(req.body.limit, 10)
  const skip = (page - 1) * limit

  const options = {
    page,
    limit,
    collation: {
      locale: 'en',
      strength: 2,
    },
    sort: { createdAt: -1 }

  };
  console.log("options", options)


  // return 
  try {
    // Get all unique donors ids from Inventory if it matches the Org. then show unique donors
    const donor = new mongoose.Types.ObjectId(req.body.userID);

    const aggregationPipelineResult = await InventoryModel.aggregate([
      {
        $match: {
          inventoryType: 'Incoming',
          donor,
        },
      },
      {
        $group: {
          _id: "$organization",
        },
      },
    ]).exec();
    const populateKeyword = 'users'

    const aggregationResult = await performPopulateAfterAggregationPipeline(aggregationPipelineResult, populateKeyword)
    const response = formAggregateResponse(aggregationResult, options)

    return res.json({
      success: true,
      message: "Donors Data Fetched Successfully",
      data: response,
    })
  } catch (error) {

    console.log("error", error)
    return res.json({
      success: false,
      message: error.message,
    });
  }
})

// This retrieves a list of all the organizations to which an Hospital has asked/purchased blood donations.
// 
usersRouter.post('/get-all-org-for-hospital', authMiddleware, async (req, res) => {
  const page = parseInt(req.body.page, 10)
  const limit = parseInt(req.body.limit, 10)
  const skip = (page - 1) * limit

  const options = {
    page,
    limit,
    collation: {
      locale: 'en',
      strength: 2,
    },
    sort: { createdAt: -1 }

  };
  console.log("options", options)


  // return 
  try {
    // Get all unique donors ids from Inventory if it matches the Org. then show unique donors
    const hospital = new mongoose.Types.ObjectId(req.body.userID);

    const aggregationPipelineResult = await InventoryModel.aggregate([
      {
        $match: {
          inventoryType: 'Outgoing',
          hospital,
        },
      },
      {
        $group: {
          _id: "$organization",
        },
      },
    ]).exec();
    const populateKeyword = 'users'

    console.log("aggregationPipelineResult", aggregationPipelineResult)

    const aggregationResult = await performPopulateAfterAggregationPipeline(aggregationPipelineResult, populateKeyword)
    const response = formAggregateResponse(aggregationResult, options)

    return res.json({
      success: true,
      message: "Data Fetched Successfully",
      data: response,
    })
  } catch (error) {

    console.log("error", error)
    return res.json({
      success: false,
      message: error.message,
    });
  }
})


const performPopulateAfterAggregationPipeline = async (aggregationPipelineResult, populateKeyword) => {
  return await InventoryModel.populate(aggregationPipelineResult, {
    path: '_id',
    model: populateKeyword,
  })
}

const formAggregateResponse = (aggregationResult, options) => {
  // console.log("aggregationResult", aggregationResult.length)
  const totalCount = aggregationResult.length
  const totalPages = Math.ceil(totalCount / options.limit);

  return {
    aggregationResult,
    totalDocs: totalCount,
    limit: options.limit,
    totalPages,
    page: options.page,
    hasNextPage: options.page < totalPages,
    hasPrevPage: options.page > 1,
    prevPage: options.page > 1 ? options.page - 1 : null,
    nextPage: options.page < totalPages ? options.page + 1 : null
  }
}


// Forgot Password
usersRouter.post("/forgotPassword", async (req, res) => {
  console.log("req.body", req.body);


  const { email } = req.body;



  const existingUser = await UserModel.findOne({ email })
  console.log("req", existingUser);



  if (!existingUser || existingUser == null) {
    console.log("e-------")
    return res.status(401).send({ message: "No user found with this email address" });
  }





  // Set up the email transporter
  const directory = path.join(__dirname, "..", "utils", "resetPassword.html");
  const fileRead = fs.readFileSync(directory, "utf-8");
  const template = handlebars.compile(fileRead);
  const htmlToSend = template({ name: existingUser.name, userId: existingUser._id });
  // console.log("template--------->", htmlToSend);
  // console.log("htmlToSend", htmlToSend);



  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.NodeMailerUser,
      pass: process.env.NodeMailerPass,
    },
  });


  // user: 'info@headsupcorporation.com',
  // pass: 'jChfuR5QhEas',
  // host: "smtp.zoho.com",
  // port: 465,
  // secure: true,
  // Composing the email


  const mailOptions = {
    from: 'chaudharysourav.vats@gmail.com',
    to: email,
    subject: "Password Reset Request",
    html: htmlToSend,
  };


  // Sending the email

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('Error sending Email', err)
      return handleResponse(req, res, 404, "Error sending Email", false)
    }
    console.log("Info", info)
    return handleResponse(req, res, 200, "Password reset email sent", true)
  });



})


// RESET Password Route via Forgot Password
usersRouter.patch("/resetPassword", async (req, res) => {
  const idToCheck = req.body.id
  const { password } = req.body.values
  const oldUser = await UserModel.findOne({ _id: idToCheck });

  if (!oldUser) {
    return res.json({ status: "User doesn't exist !", success: false });
  }
  try {

    const hashedPassword = await bcrypt.hash(password, 10);
    const setNewPass = await UserModel.findByIdAndUpdate(
      { _id: idToCheck },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    res.status(201).send({ message: "Password updated successfully", success: true });
  } catch (error) {
    res.json({ status: "Something Went Wrong" });
  }
})


// create RESET PASSWORD LATER






































// export
module.exports = { usersRouter };


