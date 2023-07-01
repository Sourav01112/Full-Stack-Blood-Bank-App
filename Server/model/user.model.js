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

    // is required only if the userType is Organisation
    organisationName: {
      type: String,
      required: function () {
        if (this.userType === "organisation") {
          return true;
        } else {
          return false;
        }
      },
    },

    // is required only if the userType is Organisation & hospital
    website: {
      type: String,
      required: function () {
        if (this.userType === "organisation" || this.userType === "hospital") {
          return true;
        } else {
          return false;
        }
      },
    },

    // is required only if the userType is Organisation & hospital
    address: {
      type: String,
      required: function () {
        if (this.userType === "organisation" || this.userType === "hospital") {
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

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
