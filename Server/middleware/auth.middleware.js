const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {

  const tokenExists = req.headers.authorization?.split(" ")[1];
  if (tokenExists) {
    try {
      const decoded = jwt.verify(tokenExists, process.env.JWTSecret);
      if (decoded) {
        console.log("decoded", decoded)
  
        // req.body.userID = decoded.userID;

        req.body = req.body ? { ...req.body, userID: decoded.userID } : { userID: decoded.userID };

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
