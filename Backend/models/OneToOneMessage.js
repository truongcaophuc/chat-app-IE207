const mongoose = require("mongoose");

const oneToOneMessageSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      to: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      from: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      type: {
        type: String,
        // enum: ["Text", "File", "Link"],
      },
      created_at: {
        type: Date,
        default: Date.now(),
      },
      text: {
        type: String,
      },
      fileUrl: {
        type: String,
      },
      fileName: {
        type: String,
      },
      fileSize: {
        type: String,
      },
      is_read: {
        type: Boolean,
        default:false,
      },
      isPin: {
        type: Boolean,
        default:false,
      },
      replyTo: {
        type: Object,
      },
    },
  ],
});

const OneToOneMessage = new mongoose.model(
  "OneToOneMessage",
  oneToOneMessageSchema
);
module.exports = OneToOneMessage;