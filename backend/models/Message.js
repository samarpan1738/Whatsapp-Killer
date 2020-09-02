const mongoose = require("mongoose");

let messageSchema = new mongoose.Schema(
    {
        // from: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "User",
        // },
        content: {
            type: String,
        },
        type: {
            type: String,
            enum: ["sent", "received"],
            default: "sent",
        },
        status: {
            type: String,
            enum: ["sent", "delivered", "read"],
            default: "sent",
        },
    },
    { timestamps: { currentTime: () => Date.now() } }
);

let Message = new mongoose.model("Message", messageSchema);

// console.log(User);

module.exports = {
    Message,
    messageSchema,
};
