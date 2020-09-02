let chatHeads = document.getElementsByClassName("chat-head");
chatHeads = Array.from(chatHeads);
// let path=require('path')
let currentUser = {};
let origin = "http://192.168.0.105:2000";

let globalContacts = {
    dave: {
        dpUrl: "https://source.unsplash.com/50x50/?face",
        name: "David Goggins",
        username: "dave",
        lastSeen: "Date.now()",
        status: "online | offline",
        // lastMessage: "Last Message!", = messages[messages.length-1]
        messages: [
            {
                id: "121",
                content: "Hello there!!",
                type: "sent | received",
                status: "sent | delivered | read",
                timestamp: "Date.now()",
            },
        ],
    },
};

initialSetup();

$("#delete-convo").on("click", () => {
    $(".hero-section").empty();
    // TODO: Delete from globalContacts and from server too
});

$(".send-msg-btn").on("click", () => {
    send();
});

$("li.unread").on("click", (e) => {
    // console.log(e.target);
    $("li.unread>div.unread").remove();
    $("li.unread").removeClass("unread");
});

$(".msg-input").on("keydown", (e) => {
    if (e.keyCode == 13) send();
});

function send() {
    let msg = $(".msg-input").val();
    if (msg.trim().length != 0) {
        $(".hero-section").append(
            $("<div>")
                .attr("class", "sender-msg-box msg-box")
                .append(
                    $("<p>").attr("class", "sender-msg msg-content").text(msg)
                )
        );
        $(".msg-input").val("");
        $(".msg-input").focus();
        //Scroll to bottom
        let heroSection = $(".hero-section");
        heroSection.scrollTop(heroSection.prop("scrollHeight"));

        //socket request
        let to = $(".selected").attr("id");
        sendMessage(globalContacts[to].info._id, msg, currentUser._id);
        // socket.emit("sendToOne", {
        //     to,
        //     content: msg,
        // });
        globalContacts[to].messages.push({
            content: msg,
            timestamp: Date.now(),
            type: "sent",
        });
    } else console.log("empty msg");
}

// * **********CRUD OPERATIONS*********

// * ADD / CREATE GROUP
$("#createNewGroup").click((e) => {
    console.log("CreateGroup button clicked");

    let groupName = $("#groupNameInput").val();
    if (groupName.trim().length != 0) {
        createGroup(groupName);
        // Save to contacts
        contacts.push({
            dpUrl: "https://source.unsplash.com/50x50/?face",
            name: groupName,
            lastMessage: "Last Message!",
        });
        loadSingleContact({
            dpUrl: "https://source.unsplash.com/50x50/?face",
            name: groupName,
            lastMessage: "Last Message!",
        });
    }
});

// * LOGIN / SIGNUP
$(".authBtn").click((e) => {
    e.preventDefault();

    let { username, password, displayName } = getUserInfo();
    let authOption = e.target.innerText;
    let reqBody = {
        username,
        password,
    };
    if (authOption == "Login") authOption = "login";
    else if (authOption == "Signup") {
        authOption = "user";
        reqBody.displayName = displayName;
    }

    fetch(`http://192.168.0.105:2000/${authOption}`, {
        method: "post",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
    })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            let { msg, user, contacts } = data;
            if (msg == "Logged In") {
                currentUser = user;
                onLoggedIn();
                globalContacts = contacts;
                loadContacts();
                socket.emit("serialize", { id: user._id });
            } else if (msg == "Password Mismatch") {
                console.log(msg);
                // $("#password").css("background-color", "lightcoral");
            }
        })
        .catch((err) => {
            console.log(err);
        });
});
// * ADD CONTACT
$("#addNewContact").click((e) => {
    let contactName = $("#contactNameInput").val().trim();

    // checking if i/p is empty OR if contacts already exists
    if (contactName.length != 0 && !globalContacts[contactName]) {
        // Send socket request
        // socket.emit("addContact", { target: contactName });
        let contact = {
            dpUrl: "https://source.unsplash.com/50x50/?face",
            name: contactName,
            lastMessage: "Request Sent",
        };
        // TODO: Send POST request
        fetch(`http://192.168.0.105:2000/contact`, {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_username: currentUser.username,
                contact_username: contactName,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                let { msg, contact } = data;
                if (msg == "Added Contact") {
                    //  TODO:Add to globalContacts and render it
                    console.log(contact);
                    globalContacts[contactName] = contact;
                    loadContacts();
                    // globalContacts[contactName]={
                    //   messages:[],
                    // }
                }
            });
        // Add to contacts array
        // contacts.push(contact);
        // load contact
        // loadSingleContact(contact);
    }
});
