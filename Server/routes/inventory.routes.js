const express = require("express");
const inventoryRouter = express.Router();
const UserModel = require("../model/user.model");
const { authMiddleware } = require("../middleware/auth.middleware");
const InventoryModel = require("../model/inventory.model");

// Add Inventory

inventoryRouter.post("/addInventory", authMiddleware, async (req, res) => {
  const { email } = req.body;
console.log("req/body", req.body)

  try {
    // based on email and inventoryType : Validation
    // fetch user

    const user = await UserModel.findOne({ email });
    // console.log("@@@@@@@@@@", user.userType);
    // checks
    if (!user) throw new Error("Invalid Email");
    if (req.body.inventoryType === "Donation-In" && user.userType !== "donor") {
      throw new Error("The email is not recognized as Donor");
    }
    if (
      req.body.inventoryType === "Donation-Out" &&
      user.userType !== "hospital"
    ) {
      throw new Error("The email is not recognized as hospital");
    }
    //  saving ID as per Inventory Type

    if (req.body.inventoryType === "Donation-Out") {
      // validation for Out : If we have A+ : 100ML and we are sending 120ML out, it should throw error
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantity = req.body.quantity;
      const oraganization = req.body.userID;

      req.body.hospital = user._id;
    } else {
      req.body.donor = user._id;
    }

    // add Inventory
    const inventory = new InventoryModel(req.body);
    await inventory.save();
    res.status(200).send({
      success: true,
      message: "Inventory has been added successfully",
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

// get Inventory
inventoryRouter.post("/getInventory", authMiddleware, async (req, res) => {
console.log("inside get inventor ###>", req.body)
  const options = {
    page: req.body.page,
    limit: req.body.limit,
    collation: {
      locale: 'en',
    },
    populate: ["donor", "hospital"],
    sort: {createdAt: -1}
  };

  console.log("search", req.body.search)
  try {

  
    InventoryModel.paginate(req.body.search, options, function(err,doc){
      if(doc.docs !== null){
        console.log("doc", doc)
        return res.send({
          success: true,
          data: doc,
          message : 'Fetched'
        });
      }else{
        console.log("inside else")

      }
    })
  }
  catch (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = { inventoryRouter };



/*     const inventory = await InventoryModel.find({
      organization: req.body.userID,
    })
      .populate("donor")
      .populate("hospital")
      // .populate('organization')
    console.log(inventory); 

    return res.send({
            success: true,
            data: inventory,
            message : 'Fetched'
          }); */