let chatHeads=document.getElementsByClassName('chat-head')
chatHeads=Array.from(chatHeads)
// let path=require('path')
let currentUser={}
let origin='http://localhost:2000';
let conversations={
    'username':[
        // {
        //     content:'Hello bro',
        //     timestamp:'time',
        //     type:'received || sent'
        // }
    ]//Array of messages. Each message has a timestamp. Sort array based on timestamp    
}
let contacts=[
    // {
        //     dpUrl:"https://source.unsplash.com/50x50/?face",
        //     name:'David Goggins',
        //     lastMessage:'Last Message!'
        // },{
            //     dpUrl:"https://source.unsplash.com/50x50/?face",
//     name:'Matt D\'avella',
//     lastMessage:'Last Message!'
// },{
//     dpUrl:"https://source.unsplash.com/50x50/?face",
//     name:'Joe Rogan',
//     lastMessage:'Last Message!'
// }
]
// console.log(contacts.length==0);
function stageSection(parentName,sectionName)
{
    $('.'+parentName).children().each((idx,element)=>{
        $(element).hide();
    })
    // console.log(sectionName);
    $('.'+sectionName).show();
}
function initialSetup() 
{
    $('.auth').hide();
    if(contacts.length==0)
    {
        if($('.recent-chats').length==0)
        {
            $('.stage').append($('<ul>').attr('class','recent-chats'));
        }
        else
            $('.recent-chats').empty();

        $('.recent-chats').append($('<li>').attr('class','recent-chat-placeholder').append($('<p>').text('No recent chats.')));
        // console.log($('.recent-chatssss'));
    }
    else
    {
        loadContacts();
    }
    stageSection('stage','recent-chats');

    /*
    
    */
}
initialSetup();

function createContactElement(contact)
{
        if(conversations[contact.name])
        {
            console.log("Contact already present");
            return null;
        }

        let div=$('<div>')
        .attr('class','chat-head')
        .attr('id',contact.name)
        .append($('<img>').attr('class','dp-icon').attr('src',contact.dpUrl))
        .append($('<div>').attr('class','recent-meta')
        .append($('<p>').attr('class','chat-head-title').text(contact.name))
        .append($('<p>').attr('class','chat-head-msg').text(contact.lastMessage)))
        .append($('<div>').attr('class','chat-head-options')
        .append($('<ul>').attr('class','options-list')
        .append($('<li>').text('Archive Chat'))
        .append($('<li>').text('Delete Chat'))
        .append($('<li>').text('Mark as read'))
        ))
        .on('contextmenu',(e)=>{
            e.preventDefault()
            console.log(e);
            console.log(e.currentTarget);
            let options=e.currentTarget.childNodes[2];
    
            options.style['display']='block';
            options.style['left']=Math.min(228,e.offsetX)+'px';
            options.style['top']=e.offsetY+'px';
    
    
        })
        
        .on('click',(e)=>{
            // let target=e.currentTarget;
            // console.log(e.target);
            let username=e.currentTarget.childNodes[1].childNodes[0].innerText;
            // console.log(username);

            $('#meta-info').children()[0].innerText=username
            $('.refreshed').css('display','none')
            $('.conversation').css('display','grid')
            
            // console.log("Load "+e.currentTarget.id+'\'s conversation');
            loadConversation(e.currentTarget.id);
            
            //Scroll to bottom
            $('.hero-section').scrollTop($('.hero-section').prop('scrollHeight'));
        })

        conversations[contact.name]=[];

        return div;
}

function loadContacts(contacts)
{
    
    console.log(contacts);
    $('.recent-chats').empty()

    contacts.forEach(contact=>{
        let div=createContactElement(contact);
        if(div!=null)
            $('.recent-chats').append(div);
    
    })
}

function loadConversation(username)
{
    console.log(username);
    let messages=conversations[username];
    // console.log("Messages --> "+messages);
    // console.log(messages[0]);
    // messages=messages.sort((a,b)=>a.timestamp<b.timestamp);
    $('.hero-section').empty();
    messages.forEach(msg=>{
        let {content,timestamp,type}=msg;
        console.log(msg);
        let div=$('<div>');
        if(type=='received')
        {
            div
            .attr('class','msg-box recipient-msg-box')
            .append($('<img>')
            .attr('src','https://source.unsplash.com/50x50/?face')
            .attr('class','dp-icon'))
            .append($('<p>')
            .attr('class','recipient-msg msg-content')
            .text(content))

        }
        else
        {
            div
            .attr('class','sender-msg-box msg-box')
            .append($('<p>')
            .attr('class','sender-msg msg-content')
            .text(content))
        }
        $('.hero-section').append(div);
    })
}

$('#delete-convo').on('click',()=>{
    $('.hero-section').empty()
})

//Add a new msg to .hero-section
$('.send-msg-btn').on('click',()=>{
    let msg=$('.msg-input').val();
    if(msg.trim().length!=0)
    {
        $('.hero-section')
        .append($('<div>')
        .attr('class','sender-msg-box msg-box')
        .append($('<p>')
        .attr('class','sender-msg msg-content')
        .text(msg)))
        $('.msg-input').val('')
        $('.msg-input').focus()

        //Scroll to bottom
        let heroSection=$('.hero-section');
        heroSection.scrollTop(heroSection.prop('scrollHeight'));
        
        //socket request 
        let to=$('#meta-info>h3').text();
        socket.emit('sendToOne',
        {   
            to,
            content:msg
        });
        conversations[to].push(
            {
                content:msg,
                timestamp:new Date().toUTCString(),
                type:'sent'
            }
        )
    }
    else
        console.log('empty msg');
})

$('li.unread').on('click',(e)=>{
    // console.log(e.target);
    $('li.unread>div.unread').remove();
    $('li.unread').removeClass('unread')
})


$('#toggleAddGroup').click((e)=>{
    //1) Stage the section
    stageSection('stage','addGroupSection');
    //0) Close options-menu 
    if(document.getElementById('profile-options-checkbox').checked)
        document.getElementById('profile-options-checkbox').checked=false;
    // $('.recent-chats').hide();
    // $('.stage').remove();
    // $('.side-bar').append($('<div>').attr('class','stage'));
    
    //2) Append addGroup section / Show menu to add group
    // $('.stage').append($('<div>')
    // .attr('class','addGroupSection')
    // .append($('<input>')
    // .attr('type','text')
    // .attr('name','groupName')
    // .attr('placeholder','Enter group name')
    // .attr('id','groupNameInput'))
    // .append($('<button>')
    // .attr('id','createNewGroup')
    // .attr('disabled','true')
    // .text('Create Group'))
    // );
})

$('#createNewGroup').click(()=>{
    let groupName=$('#groupNameInput').val();
    if(groupName.trim().length!=0)
    {
        // $('#groupNameInput').css('border-color','red');
        // $('#groupNameInput').css('border-color','black');
        socket.emit('createGroup', {name:groupName,author:currentUser.uname});
    }
})

function loadForm(type)
{
    $('.refreshed .placeholder').hide();
    $('.auth').show();
    $('.authBtn').text(type)
    $('.authHeading').text(type);
}

function getUserInfo()
{
    let username=$('#username').val();
    let password=$('#password').val();
    username=username.trim();
    password=password.trim();
    return {username,password}
}

$('.toggleAuth').click((e)=>{
    // e.preventDefault();
    // console.log(e.target.innerText);
    // console.log('Login Btn clicked!');
    loadForm(e.target.innerText);
})

function onLoggedIn()
{
    $('#createNewGroup').removeAttr('disabled');
    $('#addNewContact').removeAttr('disabled');
    $('.loggedIn').show();
    $('.loggedOut').hide();
    $('.refreshed .placeholder').show();
    $('.auth').hide();
    $('.authBtn').text('')
    $('.authHeading').text('');
}

// Login and Signup
$('.authBtn').click((e)=>
{
    e.preventDefault();

    let {username,password}=getUserInfo();  
    let authOption=e.target.innerText;

    if(authOption=='Login')
        authOption='login';
    else if(authOption=='Signup')
        authOption='user';
    
    fetch(`http://localhost:2000/${authOption}`, {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
        })
        .then( (res) => { 
            return res.json()
        })
        .then(data=>
            {
                console.log(data)
                let {msg}=data;
                 if(msg=='Logged In')
                {
                    currentUser.uname=username;
                    onLoggedIn();
                    socket.emit('serialize', {uname:username});
                }
                else if(msg=='Password Mismatch')
                {
                    $('#password').css('background-color','lightcoral');
                }
            })
        .catch(err=>{
            console.log(err);
        })

});

$('#toggleAddContact').click((e)=>{
    stageSection('stage','addContactSection');
    // console.log('toggleAddContact');
    if(document.getElementById('profile-options-checkbox').checked)
        document.getElementById('profile-options-checkbox').checked=false;
    // console.log($('#profile-options-checkbox'));
})
function addContact()
{
    fetch(`http://localhost:2000/user/${currentUser.uname}/contacts`,
        {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                contactName
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data);
            console.log(data.constructor==Array);
            if(res && res.constructor==Array)
            {
                // console.log(loadContacts);
                // let c=[];
                contacts=[]
                data.forEach(name=>{
                    contacts.push({
                        dpUrl:"https://source.unsplash.com/50x50/?face",
                        name:name,
                        lastMessage:'Last Message!'
                    })
                })
                // console.log(contacts);
                // contacts=res;
                loadContacts(contacts);
            }
            // getContacts();
        })
}

$('#addNewContact').click(e=>{
    let contactName=$('#contactNameInput').val().trim();
    
    if(contactName.length!=0 && !conversations[contactName])
    {
        // Send socket request
        socket.emit('addContact', {target:contactName});
        
        let div=createContactElement({
            dpUrl:"https://source.unsplash.com/50x50/?face",
            name:contactName,
            lastMessage:'Request Sent'
        })
        
        if(div!=null)
        {
            if($('.recent-chats').children()[0].className=="recent-chat-placeholder")
                $('.recent-chats').empty();

            $('.recent-chats').append(div);
        }
        // conversations[contactName]=[];
    }
    
})

$('.auth .back').click((e)=>{
    $('.auth>form>input').each((idx,data)=>{
        // console.log(data);
        data.value='';
        data.style['background-color']='#FFFFFF';
    })
    //Hide auth and show placeholder
    stageSection('refreshed','placeholder');
})
$('.stage .back').each((idx,element)=>{
    element=$(element);
    element.click((e)=>{
        //Stage recent-chats
        stageSection('stage','recent-chats');
    })
})

function getContacts()
{
    if(currentUser.uname)
    {
        $.get(`${origin}/user/${currentUser.uname}/contacts`,(res)=>{
            console.log(res);
            return res;
            // console.log(stat);
        })
    }
    else
    {
        console.log('Login Bro');
    }
}

$('.add').click(()=>{
    $('#toggleAddContact').click();
})

$('.create').click(()=>{
    $('#toggleAddGroup').click();
})
$('.auth>form>input').on('change',(e)=>{
    console.log(e.target);
})