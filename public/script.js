const socket = io("");
socket.on('connect',()=>{
    socket.emit('createMessage',{
        from:"shiva",
        text:"hey now brown cow"
    })
    console.log("some one connected")
})
socket.on('disconnect', () => {
    console.log("disconnected")
})
socket.on('newMessage', (message) => {
    console.log("new message",message)
})
















//old code


// var peer = new Peer(undefined,{
//     path:'/peerjs',
//     port:'3030',
//     host:"/"
// });

// const videoGrid = document.getElementById('video-grid')
// const myVideo=document.createElement('video')
// myVideo.muted=true
// let myVideoStream
// navigator.mediaDevices.getUserMedia({
//     video:true,
//     audio:true
// }).then(stream=>{
//     myVideoStream=stream
//     addVideoStream(myVideo,myVideoStream)
// })
// peer.on('open', id => {
//     socket.emit('join-room', ROOM_ID,id)
// })

// socket.on('user-connected', (userId)=>{
//     connectToNewUser(userId)
// })
// const connectToNewUser = (userId)=>{
//     console.log("new user", userId)
// }
// const addVideoStream = (video,stream)=>{
//     video.srcObject= stream
//     video.addEventListener('loadedemetadata',()=>{
//         video.play()
//     })
//     videoGrid.append(video)
// }