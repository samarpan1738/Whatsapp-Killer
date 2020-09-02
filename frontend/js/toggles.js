$("#toggleAddGroup").click((e) => {
    //1) Stage the section
    stageSection("stage", "addGroupSection");
    //0) Close options-menu
    if (document.getElementById("profile-options-checkbox").checked)
        document.getElementById("profile-options-checkbox").checked = false;
});

$(".toggleAuth").click((e) => {
    loadForm(e.target.innerText);
});

$("#toggleAddContact").click((e) => {
    stageSection("stage", "addContactSection");
    // console.log('toggleAddContact');
    if (document.getElementById("profile-options-checkbox").checked)
        document.getElementById("profile-options-checkbox").checked = false;
    // console.log($('#profile-options-checkbox'));
});

$(".auth .back").click((e) => {
    $(".auth>form>input").each((idx, data) => {
        // console.log(data);
        data.value = "";
        data.style["background-color"] = "#E9E9E9";
    });
    //Hide auth and show placeholder
    stageSection("refreshed", "placeholder");
});

$(".stage .back").each((idx, element) => {
    element = $(element);
    element.click((e) => {
        //Stage recent-chats
        stageSection("stage", "recent-chats");
    });
});

$(".add").click(() => {
    $("#toggleAddContact").click();
});

$(".create").click(() => {
    $("#toggleAddGroup").click();
});
