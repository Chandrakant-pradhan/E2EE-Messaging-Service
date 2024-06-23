const jwt = require("jsonwebtoken");
const  {User} = require("../models/user")
const mongoose = require("mongoose")

const protect = async (req, res, next) => {
   let token;
   if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ){
    try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findOne({email : decoded.id.email}).select("-password")
        next();
    } catch (error) {
    console.log(error)
       res.status(400).send("Invalid Token")
    }
  }
  if(!token){
    res.status(400).send("Token not find")
  }
};

module.exports = { protect };