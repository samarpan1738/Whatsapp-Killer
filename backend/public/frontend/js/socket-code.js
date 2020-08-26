let socket = io('http://localhost:3000');

socket.on('connect', function(){
    console.log("Connected to server "+socket.id);
});
// socket.on('ping', function(data){
//     console.log("Server ping .......");
// });
// socket.on('hello', function(data){
//     console.log(data.message);
//     socket.emit('hello',{message:"Recieved your greetings!!"})
// });
// socket
// socket.emit('createGroup', {name:'game',author:'Goggins'});

socket.on('newMemberJoined', function({participant}){
    // console.log(data.message);
    // socket.emit('hello',{message:"Recieved your greetings!!"})
    console.log(participant);
});



socket.on('request',({from})=>{
    console.log("Request from "+from);
    let contact={
        dpUrl:"https://source.unsplash.com/50x50/?face",
        name:from,
        lastMessage:'Request'
    }

    let div=createContactElement(contact);
    if(div!=null)
    {
        if($('.recent-chats').children()[0].className=="recent-chat-placeholder")
            $('.recent-chats').empty();

        $('.recent-chats').append(div);
        $('.hero-section')
        .append(
            $('<h1>')
            .attr('class','heading')
            .text('Added via Search')
        )
    }
})

socket.on('directMessage',({from,content})=>{
    console.log('Received Message from '+from);
    if(!conversations[from])
    {
        conversations[from]=[];
    }
    conversations[from].push(
        {
            content,
            timestamp:new Date().toUTCString(),
            type:'received'
        }
    )
    if($('#meta-info>h3').text()==from)
    {
        $('.hero-section')
        .append($('<div>')
        .attr('class','recipient-msg-box msg-box')
        .append($('<img>')
        .attr('src','https://source.unsplash.com/50x50/?face')
        .attr('class','dp-icon'))
        .append($('<p>')
        .attr('class','recipient-msg msg-content')
        .text(content))
        )
        // $('.msg-input').val('')
        // $('.msg-input').focus()

        //Scroll to bottom
        let heroSection=$('.hero-section');
        heroSection.scrollTop(heroSection.prop('scrollHeight'));
    }
})

socket.on('getContacts',(data)=>{
    console.log(data);
})
// socket.emit('rejectRequest',{from:})