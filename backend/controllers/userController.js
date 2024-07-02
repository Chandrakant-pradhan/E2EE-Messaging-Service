const { tokenGenerator } = require("../config/tokenGenerator");
const { User, validateUser } = require("../models/user");

const authenticateUser = async (req, res) => {
    //before login you genereate public and private keys in the frontend
    //then save the public key in the backend so that you can access public keys 
    //of other users
    const { email, password} = req.body;

    if (!email || !password) {
        return res.status(400).send({ error: "Fill all fields" });
    }

    try {
        const user = await User.findOne({ email });
        if (user && user.matchPassword(password)) {
            res.status(200).send({
                _id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                profileURL: user.profileURL,
                publicKey: user.publicKey,
                isAdmin: user.isAdmin,
                token: tokenGenerator({ email: user.email }),
            });
        } else {
            res.status(400).send({ error: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).send({ error: "Error in Login" });
    }
};

const signup = async (req, res) => {

    const { name, email, password  , PublicKeyString} = req.body;

    if (!name || !email || !password) {
        return res.status(400).send({ error: "Fill all fields" });
    }

    try {
        const usernameTaken = await User.findOne({ name });
        if (usernameTaken) {
            return res.status(400).send({ error: "Username Already Taken" });
        }

        const emailAlreadyExist = await User.findOne({ email });
        if (emailAlreadyExist) {
            return res.status(400).send({ error: "Email already exists" });
        }
        const user = await User.create({
            name,
            email,
            password,
            publicKey : PublicKeyString
        });

        if (user) {
            res.status(201).send({
                _id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                profileURL: user.profileURL,
                isAdmin: user.isAdmin,
                token: tokenGenerator({ email: user.email }),
            });
        } else {
            res.status(500).send({ error: "Error in signing up, try again" });
        }
    } catch (error) {
        res.status(500).send({ error: "Error in signing up, try again" });
    }
};

const allUser = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ error: "Error fetching users from database" });
    }
};

const updateUser = async (req, res) => {
    const { profileURL, bio } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profileURL, bio },
            { new: true }
        );

        if (!user) {
            res.status(404).send({ error: "User not found" });
        } else {
            res.status(200).send({
                _id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                profileURL: user.profileURL,
                publicKey: user.publicKey,
                isAdmin: user.isAdmin,
                token: tokenGenerator({ email: user.email }),
            });
        }
    } catch (error) {
        res.status(500).send({ error: "Error updating user. Please try again" });
    }
};

const removeUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user._id);

        if (!deletedUser) {
            res.status(404).send({ error: "User not found" });
        } else {
            res.status(200).send(deletedUser);
        }
    } catch (error) {
        res.status(500).send({ error: "Error deleting user. Please try again" });
    }
};

const searchUser = async (req, res) => {
    const keyword = req.query.search
        ? {
            name: { $regex: req.query.search, $options: "i" },
        }
        : {};

    try {
        const users = await User.find(keyword).select("-password");
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ error: "Error in getting searched user" });
    }
};

module.exports = {
    authenticateUser,
    signup,
    allUser,
    updateUser,
    removeUser,
    searchUser,
};
