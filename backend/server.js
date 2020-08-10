require('dotenv').config()
const express=require('express')
const app=express()
const PORT=process.env.PORT || 2000
const server=require('http').createServer(app);
const io = require('socket.io')(server);
/* Socket.io Section */
let rooms=[]
let mapper=[]//socketId -> roomName
io.on('connect',onConnect)

function onConnect(socket)
{
    console.log("Socket --> ",socket.id);
    let isPresent=mapper.find(user=>user.id==socket.id);
    if(isPresent!=-1)
    {
        let user={
            id:socket.id,
            name:name
        };
        mapper.push(user);
    }
    console.log(socket.rooms);
    console.log('connected');
    socket.emit('hello',{message:"Hello from socket.io backend"})
    socket.on('hello',(data)=>{
        console.log("hello route");
        console.log(data.message);
    })
    socket.on('createGroup',({name,author})=>{
        console.log(`createGroup ${name} ${author}`);
        socket.join(name,() => {
            let rooms = Object.keys(socket.rooms);
            mapper.push()
            console.log(rooms); // [ <socket.id>, 'room name' ]
          })
        rooms.push({name,author})
    })
    socket.on('joinGroup',({groupName,participant})=>{
        socket.join(groupName)
        socket.to(groupName).emit('newMemberJoined',{participant})
    })
}

server.listen(3000,()=>{
    console.log("Socket.io server started at https://localhost:3000");
})
app.listen(PORT,()=>{
    console.log(`App Server started at http://localhost:${PORT}`);
})
console.log(process.end);