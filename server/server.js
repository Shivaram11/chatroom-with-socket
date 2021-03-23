const express = require("express")
const path = require("path")
const {v4:uuidv4} = require('uuid')
const app = express()
const server=require("http").Server(app)
const io =require("socket.io")(server)
const {generateMessage,generateLocationMessage}= require("./util/message")
const {Users}= require("./util/users")
const {isRealString}= require("./util/isRealString")
const {ExpressPeerServer}= require("peer")
const { callbackify } = require("util")
const peerServer = ExpressPeerServer(server,{
    debug:true
})
let users= new Users()


const port = process.env.port||3030;
app.set("view engine","ejs");
const publicPath=path.join(__dirname,'/../public')
app.use(express.static('public'))
//new one
io.on('connection',(socket)=>{
    console.log("user connected")
   
    socket.on("join",(params,callback)=>{
        if(!isRealString(params.room) || !isRealString(params.name)){
            return callback('its not valid the name and the room ')
        }
        socket.join(params.room)
        users.removeUser(socket.id)
        users.addUser(socket.id,params.name,params.room)
        io.to(params.room).emit('updateUsersList',users.getUserList(params.room))
        socket.emit('newMessage',generateMessage('admin',`welcome to the ${params.room}`))
        socket.broadcast.to(params.room).emit('newMessage',generateMessage('admin','new user joined'))
        callback()
    })
    socket.on("createMessage",(message, callback) => {
        // console.log(callback)
        // console.log("b4 callback")
        let user=users.getUser(socket.id)
        if(user&&isRealString(message.text)){

            io.to(user.room).emit('newMessage',generateMessage(user.name,message.text) )
        }
        // callback('msggggg')  
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
let user=users.removeUser(socket.id)
console.log(user)
if(user){
    io.to(user.room).emit('updateUsersList',users.getUserList(user.room))
    io.to(user.room).emit('newMessage',generateMessage('admin',`${user.name} left the ${user.room} chat`))
}
    })
    socket.on("createLocationMessage",(coords)=>{
        console.log(coords)
        let user=users.getUser(socket.id)
        if(user){

            io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.lat,coords.lng))
        }
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