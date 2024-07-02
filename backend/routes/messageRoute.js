const express = require("express")
const {getMessages , sendMessage} = require("../controllers/messageController")
const {protect} = require("../middleware/authentication")
const router = express.Router(); 

//define the routes
//what do you want

//you are authenticated so get the messages with user 
// /api/message/:id
//with id = req.param.id
router.route("/:receiverID").get(protect , getMessages);

// post request on /api/message/:id
//send message on that particular id
router.route("/:receiverID").post(protect , sendMessage);




module.exports = router