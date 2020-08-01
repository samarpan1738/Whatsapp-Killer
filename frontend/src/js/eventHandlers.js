let chatHeads=document.getElementsByClassName('chat-head')
chatHeads=Array.from(chatHeads)

// console.log(chatHeads);
chatHeads.forEach((head)=>{
    // console.log(head);
    head.addEventListener('click',(e)=>{
        // console.log(e.target);
        $('.refreshed').css('display','none')
        $('.conversation').css('display','grid')
        
    })
})

$('#delete-convo').on('click',()=>{
    $('.hero-section').empty()
})

$('.send-msg-btn').on('click',()=>{
    let msg=$('.msg-input').val();
    if(msg.trim().length!=0)
    {
        $('.hero-section')
        .append($('<div>')
        .attr('class','sender-msg-box msg-box')
        .append($('<p>')
        .attr('class','sender-msg')
        .text(msg)))
        $('.msg-input').val('')
    }
    else
        console.log('empty msg');
})

$('li.unread').on('click',(e)=>{
    console.log(e.target);
    $('li.unread>div.unread').remove();
    $('li.unread').removeClass('unread')
})
