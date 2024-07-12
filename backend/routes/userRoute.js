const express = require("express");
const {
  authenticateUser ,
  authenticateUserFace,
  signup ,
  allUser, 
  updateUser , 
  removeUser , 
  searchUser 
} = require("../controllers/userController")

const {protect} = require("../middleware/authentication")
const router = express.Router();

//get request in /api/user/login
router.post("/login" , authenticateUser);

//get request in /api/user/face-login
router.post("/face-login" , authenticateUserFace);

//post request in /api/user/signup
router.post("/signup" , signup);

//get request on /api/user
//returns all the user with whom the user has chatted
router.route("/users").get(protect , allUser)

//put request on /api/user/:id
router.route("/").put(protect , updateUser)

//delete request on /api/user/:id
router.route("/").delete(protect , removeUser)

//search user
//search word in the query
router.route("/").get(protect , searchUser)


module.exports = router;
