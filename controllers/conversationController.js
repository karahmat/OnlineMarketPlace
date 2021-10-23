const express = require('express');
const router = express.Router();
const Conversation = require("../models/conversation");
const Message = require('../models/message');

//new conv

router.post("/", async(req, res) => {

  try {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);

  } catch (err) {
    res.status(500).json(err);
  }

});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
});

// deleting a conversation
router.delete("/delete/:conversationId", async(req,res)=>{
  try {    
    const message = await Message.deleteMany({conversationId: req.params.conversationId});
    const conversation = await Conversation.deleteOne({_id: req.params.conversationId});
    res.status(200).json({data: "delete success"});
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;
