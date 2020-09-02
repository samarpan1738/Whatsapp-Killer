const { User } = require("../models/User");
const { Message } = require("../models/Message");
const { Contact } = require("../models/Contact");

let rooms = [];
let iton = {}, //id:username
    ntoi = {}; //username:id
function onConnect(socket) {
    // #2
    socket.on("createGroup", ({ name, author }) => {
        console.log(`CREATE_GROUP ${name} ${author}`);

        // Join a room
        socket.join(name, () => {
            let rooms = Object.keys(socket.rooms);
            console.log(socket.rooms); // [ <socket.id>, 'room name' ]
        });

        rooms.push({ name, author });
    });
    // #3
    socket.on("joinGroup", (groupName) => {
        socket.join(groupName);
        let response = `${iton[socket.id]} joined the group`;

        console.log(`${iton[socket.id]} joined group => ${groupName}`);

        io.in(groupName).clients((err, clients) => {
            // console.log(clients);
            if (clients.length === 1)
                response = `${iton[socket.id]} created the group`;
            io.in(groupName).emit("groupEvent", response);
        });
    });
    // #4
    socket.on("serialize", ({ id }) => {
        // console.log(id);
        // TODO: Add user to iton and ntoi
        iton[socket.id] = id;
        ntoi[id] = socket.id;

        // TODO: Set status to online
        User.updateOne({ _id: id }, { status: "online" }, (err, user) => {
            if (err) throw err;
            if (user) console.log("Status set to online");
            else console.log("User not found!!");
        });

        propogateStatus(socket, id, "", "online");
    });
    // #5
    socket.on("addContact", async ({ from, to }) => {
        console.log(`Incoming add request from ${from} , to ${to}`);
    });
    // #6
    socket.on("msg", async ({ to, content, from }) => {
        console.log(`Message from ${from} to ${to} content=${content}`);
        let msg1 = await addMessage(content, from, to, "sent");
        let msg2 = await addMessage(content, to, from, "received");
        console.log(msg1, " and ", msg2);
        if (msg1 && msg2) {
            if (ntoi[to]) socket.to(ntoi[to]).emit("msg", msg1);
            else console.log("user is offline");
        }
    });
    // #8
    socket.on("disconnect", async () => {
        console.log("Disconnect req");
        // TODO: Set last seen and set status to offline
        let id = iton[socket.id];
        let lastSeen = Date.now();
        await User.updateOne(
            { _id: id },
            { lastSeen, status: "offline" },
            (err, res) => {
                if (err) throw err;
                // console.log(res);
                if (res.n == 1) {
                    console.log("Last seen updated!!");
                    // TODO: Propogate status to online contacts of this user
                    propogateStatus(socket, id, lastSeen, "offline");
                } else console.log("Status not updated");
            }
        );

        // TODO: Remove from socket list
        delete iton[socket.id];
        delete ntoi[id];
    });
}

async function propogateStatus(socket, id, lastSeen, status) {
    let user = await User.findOne({ _id: id }).populate("contacts");
    // console.log(user.contacts);

    user.contacts.forEach(({ info }) => {
        console.log(info, " and ", ntoi[info]);
        if (ntoi[info]) {
            socket.to(ntoi[info]).emit("updateStatus", {
                username: user.username,
                lastSeen,
                status,
            });
        }
    });
}

async function addMessage(content, from, to, type) {
    let from_user = await User.findOne({ _id: from }).populate("contacts");
    if (from_user) {
        for (let i = 0; i < from_user.contacts.length; ++i) {
            let { info, _id } = from_user.contacts[i];
            if (info._id == to) {
                let msg = await Message.create({ content, type });
                let res = await Contact.updateOne(
                    { _id },
                    { $push: { messages: msg._id } }
                );
                console.log(res);
                console.log(msg);
                console.log("\n\n\t\tAdded Message\n\n");
                return { msg, from_username: from_user.username };
            }
        }
        // let to_user = User.findOne({ username: from });
    }
    return false;
}

module.exports = {
    onConnect,
};
