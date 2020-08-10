let chatHeads=document.getElementsByClassName('chat-head')
chatHeads=Array.from(chatHeads)
// let path=require('path')
let contacts=[
{
    dpUrl:"https://source.unsplash.com/50x50/?face",
    name:'David Goggins',
    lastMessage:'Last Message!'
},{
    dpUrl:"https://source.unsplash.com/50x50/?face",
    name:'Matt D\'avella',
    lastMessage:'Last Message!'
},{
    dpUrl:"https://source.unsplash.com/50x50/?face",
    name:'Joe Rogan',
    lastMessage:'Last Message!'
}]
$('.recent-chats').empty()
contacts.forEach(contact=>{
    // console.log(process.platform);
    $('.recent-chats')
    .append($('<div>').attr('class','chat-head')
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
        console.log(e.target);
        let username=e.currentTarget.childNodes[1].childNodes[0].innerText;
        console.log(username);
        $('#meta-info').children()[0].innerText=username
        $('.refreshed').css('display','none')
        $('.conversation').css('display','grid')
    })
    )

})
// $('.recent-chats').empty()
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
    }
    else
        console.log('empty msg');
})

$('li.unread').on('click',(e)=>{
    // console.log(e.target);
    $('li.unread>div.unread').remove();
    $('li.unread').removeClass('unread')
})
