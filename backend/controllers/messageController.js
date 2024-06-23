const { Message } = require("../models/message");

const getMessages = async (req, res) => {
  const otherUserID = req.params.receiverID;

  if (otherUserID) {
    try {
      const messages = await Message.find({
        $or: [
          { receiver: otherUserID, sender: req.user._id },
          { receiver: req.user._id, sender: otherUserID }
        ]
      }).populate([
        { path: 'sender', select: '-password' },
        { path: 'receiver', select: '-password' }
      ]);

      res.status(200).send(messages);
    } catch {
      res.status(400).send({ error: "Error fetching messages" });
    }
  } else {
    res.status(400).send({ error: "Error in fetching users" });
  }
};

const sendMessage = async (req, res) => {
  const { content } = req.body;
  try {
    const message = await Message.create({
      content: content,
      sender: req.user._id,
      receiver: req.params.receiverID,
    });

    const populatedMessage = await message.populate([
      { path: 'sender', select: '-password' },
      { path: 'receiver', select: '-password' }
    ]);

    res.status(200).send(populatedMessage);
  } catch (error) {
    res.status(400).send({ error: error });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};
