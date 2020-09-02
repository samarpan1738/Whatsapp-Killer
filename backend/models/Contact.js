const mongoose = require("mongoose");

let contactSchema = new mongoose.Schema({
    info: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
    ],
});

let Contact = new mongoose.model("Contact", contactSchema);

// console.log(User);

module.exports = {
    Contact,
    contactSchema,
};
