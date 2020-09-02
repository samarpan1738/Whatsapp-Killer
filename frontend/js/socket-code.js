// const { response } = require("express");

let socket = io("http://192.168.0.105:3000");
let contactName = "";
let this_user = "";
socket.on("connect", function () {
    console.log("Connected to server " + socket.id);
});

socket.on("newMemberJoined", function ({ participant }) {
    // console.log(data.message);
    // socket.emit('hello',{message:"Recieved your greetings!!"})
    console.log(participant);
});

socket.on("request", ({ from }) => {
    console.log("Request from " + from);
    let contact = {
        dpUrl: "https://source.unsplash.com/50x50/?face",
        name: from,
        lastMessage: "Request",
    };

    let div = createContactElement(contact);
    if (div != null) {
        if (
            $(".recent-chats").children()[0].className ==
            "recent-chat-placeholder"
        )
            $(".recent-chats").empty();

        $(".recent-chats").append(div);
        $(".hero-section").append(
            $("<h1>").attr("class", "heading").text("Added via Search")
        );
    }
});

socket.on("msg", ({ msg, from_username }) => {
    // console.log(Object.keys(msg));
    console.log("Received Message from " + from_username);
    // console.log(msg);
    // if (!conversations[from]) {
    //     conversations[from] = [];
    // }
    globalContacts[from_username].messages.push({
        content: msg.content,
        type: "received",
        timestamp: Date.now(),
    });
    if (
        // $("#meta-info>h3").text() == globalContacts[from_username].displayName
        $(".selected").attr("id") == from_username
    ) {
        $(".hero-section").append(
            $("<div>")
                .attr("class", "recipient-msg-box msg-box")
                .append(
                    $("<img>")
                        .attr("src", "https://source.unsplash.com/50x50/?face")
                        .attr("class", "dp-icon")
                )
                .append(
                    $("<p>")
                        .attr("class", "recipient-msg msg-content")
                        .text(msg.content)
                )
        );
        // $('.msg-input').val('')
        // $('.msg-input').focus()

        //Scroll to bottom
        let heroSection = $(".hero-section");
        heroSection.scrollTop(heroSection.prop("scrollHeight"));
    }
});

socket.on("getContacts", (data) => {
    console.log(data);
});
// socket.emit('rejectRequest',{from:})

socket.on("groupEvent", (msg) => {
    console.log(msg);
});

socket.on("contactAdded", () => {
    console.log(`${contactName} added`);
});

socket.on("someoneAddedYou", (uname) => {
    console.log(uname, " added you!");
});

socket.on("updateStatus", ({ username, lastSeen, status }) => {
    console.log("update status req " + status);
    globalContacts[username].status = status;
    globalContacts[username].lastSeen |= lastSeen;
    if (status == "online") {
        $(".last-seen").text("online");
    } else {
        $(".last-seen").text(
            "last seen at " + new Date(lastSeen).toString().split(" GMT")[0]
        );
    }
});

// ************TESTING*************

function joinGroup(name) {
    socket.emit("joinGroup", name);
}

function serialize(uname) {
    this_user = uname;
    socket.emit("serialize", uname);
}

function addContact(from, to) {
    // contactName=uname;
    // console.log(this_user,' ',uname);
    socket.emit("addContact", { from, to });
}

function register(displayName, username, password) {
    fetch("/user", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            displayName,
            username,
            password,
        }),
    }).then((response) => {
        console.log(response);
    });
}

function login(username, password) {
    fetch("/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    }).then(({ status }) => {
        if (status == 201) {
            this_user = username;
            serialize(username);
        }
    });
}

function sendMessage(to, content, from) {
    socket.emit("msg", { to, content, from });
}
