const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ["offline", "online"],
        default: "online",
    },
    lastSeen: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    contacts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contact",
        },
    ],
});

let User = new mongoose.model("User", userSchema);

module.exports = {
    User,
};
