const express = require("express");
const inventoryRouter = express.Router();
const UserModel = require("../model/user.model");
const { authMiddleware } = require("../middleware/auth.middleware");
const InventoryModel = require("../model/inventory.model");
const mongoose = require("mongoose");
const { errorMonitor } = require("stream");
const { handleResponse } = require("../utils/helper");

// Add Inventory

inventoryRouter.post("/addInventory", authMiddleware, async (req, res) => {
  const { email, inventoryType, bloodGroup, organization } = req.body;
  console.log("req.body", req.body);
  try {
    // based on email and inventoryType : Validation
    // fetch user
    const user = await UserModel.findOne({ email });
    const bloodGroupCheck = await InventoryModel.find({ bloodGroup, organization })
    console.log("user", user);
    console.log("bloodGroupCheck", bloodGroupCheck);

    if (!user) throw new Error("Invalid Email");
    else if (req.body.inventoryType === "Incoming" && user.userType !== "donor") {
      throw new Error("The email is not recognized as Donor");
    }
    else if (
      req.body.inventoryType === "Outgoing" &&
      user.userType !== "hospital"
    ) {
      throw new Error("The email is not recognized as hospital");
    }
    else if (inventoryType == 'Outgoing' && bloodGroupCheck.length == 0 || bloodGroup.length == null) {
      throw new Error(`The requested blood group ${bloodGroup} is currently unavailable in the inventory`);
    }

    //  saving ID as per Inventory Type

    if (req.body.inventoryType === "Outgoing") {
      console.log("inside Out")
      // validation for Out : If we have A+ : 100ML and we are sending 120ML out, it should throw error
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantity = req.body.quantity;
      const organization = new mongoose.Types.ObjectId(req.body.userID);

      req.body.hospital = user._id;
      // below will return total amount of blood Group based on request (A+,A-,B+,B-) the organization has received till date 
      const totalINAmountOfRequestedBloodGroup = await InventoryModel.aggregate([
        {
          $match: {
            organization,
            inventoryType: 'Incoming',
            bloodGroup: req.body.bloodGroup
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: {
              $sum: "$quantity"
            }
          }
        }
      ])
      console.log({ totalINAmountOfRequestedBloodGroup })
      const totalIn = totalINAmountOfRequestedBloodGroup[0]?.total || null
      const totalOutAmountOfRequestedBloodGroup = await InventoryModel.aggregate([
        {
          $match: {
            organization,
            inventoryType: 'Outgoing',
            bloodGroup: req.body.bloodGroup
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: {
              $sum: "$quantity"
            }
          }
        }
      ])
      console.log({ totalOutAmountOfRequestedBloodGroup })
      const totalOut = totalOutAmountOfRequestedBloodGroup[0]?.total || null
      console.log("totalIn, totalOut", totalIn - totalOut);
      const availableQtyOfRequestedGroup = totalIn - totalOut
      console.log({ availableQtyOfRequestedGroup })
      if (availableQtyOfRequestedGroup < requestedQuantity) {
        throw new Error(`Only ${availableQtyOfRequestedGroup} ML units of ${requestedBloodGroup} are currently availabe.`)
      }
    } else {
      req.body.donor = user._id;
    }
    // add Inventory
    const inventory = new InventoryModel(req.body);
    await inventory.save();
    return handleResponse(req, res, 200, "Inventory has been added successfully", true)
  } catch (error) {
    return handleResponse(req, res, 400, error.message, false)
  }
});

// get Inventory
inventoryRouter.post("/getInventory", authMiddleware, async (req, res) => {


  var idfromAuthMiddleware = req?.body?.userID
  // Numbers inside String
  var numRegInString = /^\d+$/;
  // only alphabets
  const onlyAlphabetReg = /^[A-Za-z]+$/
  // Alphabets with special char.
  const alphanumericWithSpecialReg = /^[A-Za-z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/;


  const options = {
    page: req.body.page,
    limit: req.body.limit,
    collation: {
      locale: 'en',
      strength: 2,
    },
    populate: ["donor", "hospital"],
    sort: { createdAt: -1 }
  };

  console.log("req.body------", req.body)

  try {

    if (req.body.search.$text && onlyAlphabetReg.test(req.body.search.$text.$search)) {
      const dynamicFieldValue = req.body.search.$text.$search

      const schema = InventoryModel.schema;
      const fieldsToSearch = Object.keys(schema.paths).filter(
        (path) => schema.paths[path].instance === 'String'
      );
      const orConditions = fieldsToSearch.map((field) => ({
        [field]: { $regex: dynamicFieldValue, $options: "i" }
      }));
      const searchQuery = {
        $or: orConditions
      };
      const combinedQuery = {
        $and: [searchQuery, { organization: idfromAuthMiddleware }]
      };
      InventoryModel.paginate(combinedQuery, options, function (err, doc) {

        console.log("doc----->", doc)

        if (doc?.docs !== null && doc?.docs?.length !== 0) {
          return handleResponse(req, res, 200, "Fetched Inventory", doc, true)
        }
        else {
          return handleResponse(req, res, 200, "Couldn't found", doc, true)
        }
      })
    }
    // This will search anything that has alphabets + numeric values as well as Special Characters
    else if (req.body.search.$text && alphanumericWithSpecialReg.test(req.body.search.$text.$search)) {
      const dynamicFieldValue = req.body.search.$text.$search

      const schema = InventoryModel.schema;
      const fieldsToSearch = Object.keys(schema.paths).filter(
        (path) => schema.paths[path].instance === 'String'
      );

      const orConditions = fieldsToSearch.map((field) => ({
        [field]: { $regex: dynamicFieldValue, $options: "i" }
      }));

      const searchQuery = {
        $or: orConditions
      };

      const combinedQuery = {
        $and: [searchQuery, { organization: idfromAuthMiddleware }]
      };

      InventoryModel.paginate(combinedQuery, options, function (err, doc) {
        if (doc.docs !== null || doc.docs.length == 0) {
          return handleResponse(req, res, 200, "Fetched Inventory", doc, true)
        }
        else {
          return handleResponse(req, res, 200, "Couldn't found", doc, true)

        }
      })

    }
    else {

      console.log("INSIDE ELSE---")
      const combinedQuery = {
        ...req.body.search,
        organization: idfromAuthMiddleware,
      };
      console.log("combinedQuery", combinedQuery);
      InventoryModel.paginate(combinedQuery, options, function (err, doc) {


        // console.log("doc----->", doc)

        if (doc?.docs?.length !== 0 && doc !== undefined) {
          handleResponse(req, res, 200, "Fetched Inventory", doc, true)
        } else {
          console.log("inside else, ERROR---XXXX")
          handleResponse(req, res, 201, "Couldn't found", true)

        }
      })
    }
  }
  catch (error) {
    return handleResponse(req, res, 400, error.message, false)

  }
});

// get Inventory based on filters (Common Inventory Table)
inventoryRouter.post("/getInventory-filter", authMiddleware, async (req, res) => {


  console.log("----------------------inside getInventory Filter----------------------")

  console.log("req.bodyr ###>", req.body)

  var idfromAuthMiddleware = req?.body?.userID
  var inventoryType = req?.body?.filters?.inventoryType
  // var userTypeKey = req?.body?.filters?.filters?.userType;
  // console.log("userTypekey", userTypeKey);
  var combinedQuery

  // console.log("req.body.filters.userTyp", req.body.filters);

  if (req.body.filters.organization) {


    console.log("insid otrrg=-----");

    combinedQuery = {
      ...req.body.json.search,
      organization: req.body.filters.organization,
      [req?.body?.filters?.userType]: idfromAuthMiddleware,
    };
  }
  else if (inventoryType) {
    combinedQuery = {
      ...req.body.json.search,
      inventoryType,
      [req.body.filters?.userType]: idfromAuthMiddleware,
    };
  }
  else {
    console.log("insid this");
    combinedQuery = {
      ...req.body.json.search,
      [req?.body?.filters?.userType]: idfromAuthMiddleware,
    };

    console.log("combinedQueriessssssss 33333", combinedQuery);

  }




  const options = {
    page: req.body.json.page,
    limit: req.body.json.limit,
    collation: {
      locale: 'en',
      strength: 2,
    },
    populate: ["hospital", 'organization', "donor"],
    sort: { createdAt: -1 }
  };

  try {

    InventoryModel.paginate(combinedQuery, options, function (err, doc) {
      console.log("doc", doc);
      console.log("err", err);


      if (doc.docs !== null) {
        // console.log("doc", doc)
        return res.send({
          success: true,
          data: doc,
          message: 'Fetched'
        });
      } else {
        console.log("inside else")

      }
    })
  }
  catch (error) {
    console.log("error----->", error);
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});


// 
inventoryRouter.post("/update", async (req, res) => {
  console.log("req.body", req.body);

  // Use updateMany instead of findOne
  InventoryModel.updateMany(req.body, { $set: { inventoryType: 'Incoming' } }, { new: true })
    .then((updation) => {
      console.log("updation", updation);
      const count = updation.nModified; // Number of documents modified

      console.log(`Updated ${count} documents.`);
      res.status(200).json({ message: "Update successful", updatedCount: count });
    })
    .catch((error) => {
      console.error("Error updating documents:", error);
      res.status(500).json({ message: "Error updating documents", error: error.message });
    });
});


module.exports = { inventoryRouter };

