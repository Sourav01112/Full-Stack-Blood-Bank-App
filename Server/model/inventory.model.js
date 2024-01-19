const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
// var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const inventorySchema = new mongoose.Schema(
  {
    inventoryType: {
      type: String,
      required: true,
      enum: ["Incoming", "Outgoing"],
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
      ref: "users",
      required: true,
    },
    // if inventroryType is 'Outgoing' , then hospital will be set
    // if inventroryType is 'Incoming' , then Donor will be set

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: function () {
        return this.inventoryType === "Outgoing";
      },
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: function () {
        return this.inventoryType === "Incoming";
      },
    },
  },
  //Time Stamp
  {
    timestamps: true,
  }
);

inventorySchema.plugin(mongoosePaginate);
// inventorySchema.plugin(aggregatePaginate);

inventorySchema.index({
  inventoryType: 'text',
  bloodGroup: 'text',
  email: 'email'
});

const InventoryModel = mongoose.model("inventories", inventorySchema);

module.exports = InventoryModel;
