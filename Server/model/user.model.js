const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // common for All
    userType: {
      type: String,
      required: true,
      enum: ["donor", "organization", "hospital", "admin"],
    },

    // name is required only if the userType is donor or admin
    name: {
      type: String,
      required: function () {
        if (this.userType === "admin" || this.userType === "donor") {
          return true;
        } else {
          return false;
        }
      },
    },

    // is required only if the userType is hospital
    hospitalName: {
      type: String,
      required: function () {
        if (this.userType === "hospital") {
          return true;
        } else {
          return false;
        }
      },
    },

    // is required only if the userType is organization
    organizationName: {
      type: String,
      required: function () {
        if (this.userType === "organization") {
          return true;
        } else {
          return false;
        }
      },
    },

    // is required only if the userType is organization & hospital
    website: {
      type: String,
      required: function () {
        if (this.userType === "organization" || this.userType === "hospital") {
          return true;
        } else {
          return false;
        }
      },
    },

    // is required only if the userType is organization & hospital
    address: {
      type: String,
      required: function () {
        if (this.userType === "organization" || this.userType === "hospital") {
          return true;
        } else {
          return false;
        }
      },
    },

    // common
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // common
    password: {
      type: String,
      required: true,
      unique: true,
      // select: false
    },

    // common
    phone: {
      type: String,
      required: true,
    },
  },

  //Time Stamp
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
