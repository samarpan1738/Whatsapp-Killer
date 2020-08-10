let socket = io('http://localhost:3000');
socket.on('connect', function(){
    console.log("Connected to server");
});
// socket.on('ping', function(data){
//     console.log("Server ping .......");
// });
// socket.on('hello', function(data){
//     console.log(data.message);
//     socket.emit('hello',{message:"Recieved your greetings!!"})
// });
socket
socket.emit('createGroup', {name:'game',author:'Goggins'});

socket.on('newMemberJoined', function({participant}){
    // console.log(data.message);
    // socket.emit('hello',{message:"Recieved your greetings!!"})
    console.log(participant);
});

socket.on('disconnect', function(){
    console.log("Disconnected from server");
});
