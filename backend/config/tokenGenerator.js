//Todo here you would recieve 

const jwt = require("jsonwebtoken");

const tokenGenerator = (id) => {
  return jwt.sign({id} , process.env.JWT_SECRET , {expiresIn:"30d",})
};

module.exports = {tokenGenerator,};