require('dotenv').config()
const express=require('express')
const app=express()
const PORT=process.env.PORT || 2000
const server=require('http').createServer(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
let cors=require('cors');
let path=require('path');
let cookieParser=require('cookie-parser');
let {sequelize:db,User,Message,Contact}=require('./db') ;
// console.log(db);
/* Socket.io Section */
let rooms=[]
let iton={} // name -> id
let ntoi={} // id -> name
let users=[]//socketId -> roomName
io.on('connect',onConnect)
//Cors
app.use(cors());

//Body Parsers
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public','frontend')));

app.get('/user',async (req,res,next)=>{
    let rows=await User.findAll();
    // console.log(rows);
    res.send(rows);
})

app.post('/user',async (req,res,next)=>{
    console.log('Signup');
    let {username,password}=req.body;
    username=username.trim();
    password=password.trim();
    // let user=users.find(u=>u.username===username);
    // console.log(object);
    if(username.length==0 && password.length==0)
    {
        res.status(403).send('Missing Credentials');
        return;
    }

    User.create(
        {
            uname:username,
            pass:password
        }
        ).then((data)=>{
            res.status(201).send('User Added');
            console.log(data);
        }).catch(err=>{
            // console.log(err);
            res.status(409).send('Username not available');
        })
    // res.status(201);
    // console.log(user);
    // users.push({username,password});
    // users[users.length-1].contacts=[];
    
})

app.post('/login',async (req,res,next)=>{
    // console.log('Login');
    let {username,password}=req.body;
    console.log(username+" "+password);
    username=username.trim();
    password=password.trim();
    // let user=users.find(user=>user.username===username && user.password===password);
    if(username.length==0 && password.length==0)
    {
        // console.log("Username nhi mila");
        res.status(403).send({msg:'Missing Credentials'})
        return;
    }

    let user=await User.findOne({
        where:{
            uname:username
        }
    })
    if(user)
    {
        if(user.pass==password)
        {
            res.cookie('uname',user.uname);
            res.status(201).send({msg:'Logged In'});
        }
        else
            res.status(403).send({msg:'Password Mismatch'});   
    }
    else
    {
        res.status(404).send({msg:'User not found'})
    }
})

// app.get('/user/:username/contacts',(req,res,next)=>{
//     let {username}=req.params;
//     username=username.trim();
//     if(username.length!=0)
//     {
//         let user=users.find(u=>u.username==username);
//         if(user)
//         {
//             let idx=users.indexOf(user);
//             res.status(200).send(users[idx].contacts);
//         }
//         else
//         {
//             res.status(404).send(`${username} not found!`);
//         }
//     }
//     else
//     {
//         res.status(403).send('Invalid Credentials');
//     }
// })

// app.post('/user/:username/contacts',(req,res,next)=>{
//         let {contactName}=req.body;
//         let {username}=req.params;
//         let targetUser=users.find(u=>u.username===contactName);
//         let fromUser=users.find(u=>u.username===username);
//         let idx=users.indexOf(fromUser);
//         if(targetUser && fromUser)
//         {
//             //Add to from's contacts
//             if(users[idx].contacts.length==0 || users[idx].contacts.indexOf(contactName)!=-1)
//                 users[idx].contacts.push(contactName);
//             res.status(201).send(users[idx].contacts);
//         }
//         else
//         {
//             //if either of from or target dosent exist
//             if(!fromUser)
//             {
//                 res.status(404).send(`${from} not found!`);
//             }
//             else if(!targetUser)
//             {
//                 res.status(404).send(`${target} not found!`);
//             }
//         }
// })

function onConnect(socket)
{
    console.log("Socket --> ",socket.id);
    console.log(socket.rooms);
    console.log('connected');

    socket.emit('hello',{message:"Hello from socket.io backend"})
    
    socket.on('hello',(data)=>{
        console.log("hello route");
        console.log(data.message);
    })
    
    socket.on('createGroup',({name,author})=>{
        console.log(`CREATE_GROUP ${name} ${author}`);
        socket.join(name,() => {
            let rooms = Object.keys(socket.rooms);
            // mapper.push()
            console.log(socket.rooms); // [ <socket.id>, 'room name' ]
          })
        rooms.push({name,author})
    })
    
    socket.on('joinGroup',({groupName,participant})=>{
        socket.join(groupName)
        socket.to(groupName).emit('newMemberJoined',{participant})
    })
    
    socket.on('serialize',async ({uname})=>{
        ntoi[uname]=socket.id;
        iton[socket.id]=uname;
        // Send contacts if any
        let contacts=await Contact.findAll({
            where:{
                whose:uname
            }
        }) 
        socket.emit('getContacts',contacts);
    })
    
    socket.on('addContact',async ({target})=>{
        console.log(`${iton[socket.id]} added ${target}`);
        console.log('Target ki id -> '+ntoi[target]);
        let user=await User.findOne({
            where:{
                uname:target
            }
        })
        // let whose=await User.findOne({
        //     where:
        //     {
        //         uname:iton[socket.id]
        //     }
        // })
        // console.log(whose.id);
        if(user)
        {
            io.to(ntoi[target]).emit('request',{from:iton[socket.id]});
            Contact.create({
                whose:iton[socket.id],
                who:target
            })
            Contact.create({
                whose:target,
                who:iton[socket.id]
            })
        }
        else
            console.log('404! User does not exists');
    })

    socket.on('sendToOne',({to,content})=>{
        let from=iton[socket.id];
        // console.log('from --> '+from);
        if(ntoi[to])
        {
            io.to(ntoi[to]).emit('directMessage',{from,content});
            console.log("message sent");
        }
        else
            console.log("Message not sent.");
    })

    socket.on('updateStatus',({online,forr})=>{
            console.log("For --> "+forr);
    })

    socket.on('disconnect',({user})=>{
        // socket.emit('disconnected');
        // iton[socket.id]
        console.log(socket.id);
        console.log(`${iton[socket.id]} deserialized`);
        delete ntoi[iton[socket.id]];
        delete iton[socket.id];
        // ntoi[user]=null;
        // console.log(`${user} deserialized.`);
    })
    // socket.on('deserialized',({user})=>{
    // })
}

server.listen(3000,()=>{
    console.log("Socket.io server started at https://localhost:3000");
})
app.listen(PORT,()=>{
    console.log(`App Server started at http://localhost:${PORT}`);
})
// console.log(process.end);