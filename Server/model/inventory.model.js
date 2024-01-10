const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const inventorySchema = new mongoose.Schema(
  {
    inventoryType: {
      type: String,
      required: true,
      enum: ["Donation-In", "Donation-Out"],
    },
    bloodGroup: {
      type: String,
      required: true,
       
    },
    quantity: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    // getting ID with reference
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organization",
      required: true,
    },
    // if inventroryType is 'Donation-Out' , then hospital will be set
    // if inventroryType is 'Donation-In' , then Donor will be set

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: function () {
        return this.inventoryType === "Donation-Out";
      },
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: function () {
        return this.inventoryType === "Donation-In";
      },
    },
  },
  //Time Stamp
  {
    timestamps: true,
  }
);

inventorySchema.plugin(mongoosePaginate);
const InventoryModel = mongoose.model("inventories", inventorySchema);

module.exports = InventoryModel;
