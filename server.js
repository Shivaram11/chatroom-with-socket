const express = require("express")
const path = require("path")
const {v4:uuidv4} = require('uuid')
const app = express()
const server=require("http").Server(app)
const io =require("socket.io")(server)
const {ExpressPeerServer}= require("peer")
const peerServer = ExpressPeerServer(server,{
    debug:true
})

const port = process.env.port||3030;
app.set("view engine","ejs");
const publicPath=path.join(__dirname,'/../public')
app.use(express.static('public'))
//new one
io.on('connection',(socket)=>{
    console.log("user connected")
    socket.emit('newMessage',{
        from:"admin",
        text:"welcome to the chat",
        createdAt:new Date().toTimeString()
    })
    socket.broadcast.emit('newMessage', {
        from: "admin",
        text: "new user joined",
        time: new Date().toTimeString()
    })
    socket.on("createMessage",(message)=>{
        console.log("create message",message)
        io.emit('newMessage',{
            from:message.from,
            text: message.text,
            time: new Date().toTimeString()
        })
        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     time: new Date().toTimeString()
        // })
    })
    socket.emit('newMessage',{
        from: "shiva's server",
        text: "hey cow brown cow"
    })
    socket.on('disconnect', () => {
        console.log("user was disconnected")
    })
})











//old one
// app.use("/peerjs",peerServer)

// app.get("/",(req,res,next)=>{
//     // res.redirect(`/${uuidv4()}`)
// })


// app.get("/:room",(req,res,next)=>{
//     console.log(req.params.room)
//     res.render("room", { roomId: req.params.room})

// })
// io.on("connection",socket=>{
//     socket.on("join-room", (roomId,userId)=>{
//         socket.join(roomId)
//         socket.broadcast.emit('user-connected',userId)
//         // socket
//         // .to(roomId)
//         //     .emit('broadcast','user-connected')
//         // console.log("joined the room")

//     })
// })

server.listen(port)