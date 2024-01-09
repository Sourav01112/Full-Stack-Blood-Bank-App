const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const tokenExists = req.headers.authorization?.split(" ")[1];
  if (tokenExists) {
    try {
      const decoded = jwt.verify(tokenExists, process.env.JWTSecret);


      // console.log("decoded", decoded)
   
      if (decoded) {
        // encrypted ? what userID
        // attaching userID to request body
        req.body.userID = decoded.userID;
        next();
      } else {
        res.status(200).json({ message: "Not Authorized" });
      }
    } catch (error) {
      return res.send({
        success: false,
        message: error.message,
      });
    }
  } else {
    res.status(400).json({ message: "Please Login!" });
  }
};

module.exports = { authMiddleware };
