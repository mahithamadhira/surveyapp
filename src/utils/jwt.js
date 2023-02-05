const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const secret = process.env.JWT_SECRET;

exports.signToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: "1d" });
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).send({ message: "No token provided." });

  jwt.verify(token, secret, (error, decoded) => {
    if (error){
        return res.status(401).send({ message: "Unauthorized." });
    } 
    req.userId = decoded.id;
    next();
  });
};