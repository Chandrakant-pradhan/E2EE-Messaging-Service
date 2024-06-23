const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
    minLength: 2,
    maxLength: 12,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  bio: {
    type: String,
    maxLength: 25,
    default: "Hello I am a new user",
  },
  profileURL: {
    type: String,
    required: true,
    default : "https://shorturl.at/Pi92t",
   },
  publicKey: {
    type: String,
  },
});

// Before saving the instance, hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

// Verify all the input fields
const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(12),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    bio: Joi.string().max(25).default("Hello I am a new user"),
    profileURL: Joi.string().default("https://shorturl.at/Pi92t"),
    publicKey: Joi.string().optional(),
  });
  return schema.validate(user);
};

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  validateUser,
};
