const mongoose = require("mongoose");
const Joi = require("joi");

const messageSchema = new mongoose.Schema({
    content:{
        type:String,
        trim:true,
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    isRead : {
        type:Boolean,
        default:false,
    },
    decrypted : {
        type:Boolean,
        default:false,
    }
},{timestamps : true})


const validateMessage = (message) => {
    const schema = Joi.object({
        content: Joi.string().required().min(1).max(500).regex(/^(?!\s*$).+/),
    });
    return schema.validate(message);
  };

const Message = mongoose.model("Message",messageSchema);

module.exports = {
    Message,
    validateMessage
};