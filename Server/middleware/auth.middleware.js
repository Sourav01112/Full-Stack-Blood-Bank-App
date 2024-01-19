const jwt = require("jsonwebtoken");
const { handleResponse } = require("../utils/helper");
require("dotenv").config();

const authMiddleware = (req, res, next) => {

  const tokenExists = req.headers.authorization?.split(" ")[1];
  if (tokenExists) {
    try {
      const decoded = jwt.verify(tokenExists, process.env.JWTSecret);
      if (decoded) {
        // console.log("decoded", decoded)
        req.body.userID = decoded.userID;
        // req.body = req.body ? { ...req.body, userID: decoded.userID } : { userID: decoded.userID };
        next();
      } else {
        return handleResponse(req, res, 200, "Not Authorized", false)
      }
    } catch (error) {
      console.log("error in middleware", error)
      return handleResponse(req, res, 400, "Token Expired", false)
    }
  } else {
    return handleResponse(req, res, 400, "Please Login!", false)
  }
};

module.exports = { authMiddleware };
