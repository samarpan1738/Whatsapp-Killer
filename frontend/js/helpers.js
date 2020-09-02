function initialSetup() {
    $(".auth").hide();
    if (globalContacts.length == 0) {
        if ($(".recent-chats").length == 0) {
            $(".stage").append($("<ul>").attr("class", "recent-chats"));
        } else $(".recent-chats").empty();

        $(".recent-chats").append(
            $("<li>")
                .attr("class", "recent-chat-placeholder")
                .append($("<p>").text("No recent chats."))
        );
        // console.log($('.recent-chatssss'));
    } else {
        // loadContacts();
    }
    stageSection("stage", "recent-chats");

    /*
    
    */
}

function stageSection(parentName, sectionName) {
    $("." + parentName)
        .children()
        .each((idx, element) => {
            $(element).hide();
        });
    // console.log(sectionName);
    $("." + sectionName).show();
}

function createContactElement({ username, displayName }) {
    // console.log(contact);
    let div = $("<div>")
        .attr("class", "chat-head")
        .attr("id", username)
        .append(
            $("<img>")
                .attr("class", "dp-icon")
                .attr("src", "https://source.unsplash.com/50x50/?face")
        )
        .append(
            $("<div>")
                .attr("class", "recent-meta")
                .append(
                    $("<p>").attr("class", "chat-head-title").text(displayName)
                )
                .append(
                    $("<p>")
                        .attr("class", "chat-head-msg")
                        // .text(contact.lastMessage)
                        .text("last message")
                )
        )
        .append(
            $("<div>")
                .attr("class", "chat-head-options")
                .append(
                    $("<ul>")
                        .attr("class", "options-list")
                        .append($("<li>").text("Archive Chat"))
                        .append($("<li>").text("Delete Chat"))
                        .append($("<li>").text("Mark as read"))
                )
        )
        .on("contextmenu", (e) => {
            // e.preventDefault();
            // console.log(e);
            // console.log(e.currentTarget);
            // let options = e.currentTarget.childNodes[2];
            // options.style["display"] = "block";
            // options.style["left"] = Math.min(228, e.offsetX) + "px";
            // options.style["top"] = e.offsetY + "px";
        })

        .on("click", (e) => {
            $(".selected").removeClass("selected");
            e.currentTarget.classList.add("selected");
            let username = e.currentTarget.id;
            console.log(username);
            // e.currentTarget.childNodes[1].childNodes[0].innerText;
            // console.log(username);
            $("#meta-info").children()[0].innerText =
                globalContacts[username].info.displayName;
            $(".refreshed").css("display", "none");
            $(".conversation").css("display", "grid");

            let { lastSeen, status } = globalContacts[username].info;
            if (status == "online") {
                $(".last-seen").text("online");
            } else {
                $(".last-seen").text(
                    "last seen at " +
                        new Date(parseInt(lastSeen)).toString().split(" GMT")[0]
                );
            }
            // console.log("Load "+e.currentTarget.id+'\'s conversation');
            loadConversation(e.currentTarget.id);

            //Scroll to bottom
            $(".hero-section").scrollTop(
                $(".hero-section").prop("scrollHeight")
            );
        })
        .hover(
            (e) => {
                let classList = Array.from(e.currentTarget.classList);
                // console.log(classList);
                let apply = true;
                classList.forEach((cname) => {
                    if (cname == "selected") {
                        // console.log("milgya");
                        apply = false;
                        // break;
                    }
                });
                if (apply == true) {
                    // console.log(apply);
                    e.currentTarget.classList.add("hovered");
                }
            },
            (e) => {
                e.currentTarget.classList.remove("hovered");
            }
        );
    // if (globalContacts[contact.username].messages)
    // globalContacts[contact.username].messages = [];

    return div;
}
/*
 * Global contacts structure
 *    username:{
 *        info:{ username,displayName,...},
 *        messages:[{
 *           id,content,timestamp,..
 *          }]
 *    }
 */

function loadContacts() {
    // if($('.recent-chats').children()[0].className=="recent-chat-placeholder")
    //     $('.recent-chats').empty();
    // console.log(contacts);
    // console.log(globalContacts);
    $(".recent-chats").empty();
    let contact_usernames = Object.keys(globalContacts);
    contact_usernames.forEach((username) => {
        let obj = globalContacts[username];
        // console.log(obj.info);
        let div = createContactElement(obj.info);
        if (div != null) $(".recent-chats").append(div);
    });
}

function loadConversation(username) {
    let { messages } = globalContacts[username];
    // console.log("Messages --> "+messages);
    // console.log(messages[0]);
    messages = messages.sort((a, b) => a.timestamp < b.timestamp);
    $(".hero-section").empty();
    messages.forEach((msg) => {
        let { id, content, type, status, timestamp } = msg;
        // console.log(msg);
        let div = $("<div>");
        if (type == "received") {
            div.attr("class", "msg-box recipient-msg-box")
                .append(
                    $("<img>")
                        .attr("src", "https://source.unsplash.com/50x50/?face")
                        .attr("class", "dp-icon")
                )
                .append(
                    $("<p>")
                        .attr("class", "recipient-msg msg-content")
                        .text(content)
                );
        } else {
            div.attr("class", "sender-msg-box msg-box").append(
                $("<p>").attr("class", "sender-msg msg-content").text(content)
            );
        }
        $(".hero-section").append(div);
    });
}

function loadForm(type) {
    if (type == "Login") {
        //   Hide Dispaly Name
        $("#displayName").hide();
    } else $("#displayName").show();

    $(".refreshed .placeholder").hide();
    $(".auth").show();
    $(".authBtn").text(type);
    $(".authHeading").text(type);
}

function getUserInfo() {
    let username = $("#username").val();
    let password = $("#password").val();
    let displayName = $("#displayName").val();
    username = username.trim();
    password = password.trim();
    displayName = displayName.trim();
    return { username, password, displayName };
}

function onLoggedIn() {
    $("#createNewGroup").removeAttr("disabled");
    $("#addNewContact").removeAttr("disabled");
    $("h1.loggedIn").show();
    $("h1.loggedOut").hide();
    $(".refreshed .placeholder").show();
    $(".auth").hide();
    $(".authBtn").text("");
    $(".authHeading").text("");
    // Show sidebar
    $(".side-bar").removeClass("hide").addClass("show");
    $("#app").removeClass("loggedOut").addClass("loggedIn");
}

function loadSingleContact(data) {
    let div = createContactElement(data);

    if (div != null) {
        if (
            $(".recent-chats").children()[0].className ==
            "recent-chat-placeholder"
        )
            $(".recent-chats").empty();

        $(".recent-chats").append(div);
    }
}

function getContacts() {
    if (currentUser.uname) {
        $.get(`${origin}/user/${currentUser.uname}/contacts`, (res) => {
            console.log(res);
            return res;
            // console.log(stat);
        });
    } else {
        console.log("Login Bro");
    }
}

function createGroup(name) {
    console.log(name);
    socket.emit("createGroup", { name: groupName, author: currentUser.uname });
}
