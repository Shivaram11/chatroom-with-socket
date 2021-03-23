const socket = io("");
function scrollToBottom(){
    let messages = document.querySelector("#messages").lastElementChild;
    messages.scrollIntoView()
}


socket.on('connect', function() {
    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
  
    socket.emit('join', params, function(err) {
      if(err){
        alert(err);
        window.location.href = '/';
      }else {
        console.log('No Error');
      }
    })
  });
socket.on('disconnect', () => {
    console.log("disconnected")
})
socket.on('newMessage', (message) => {
  console.log("message=",message)
    const formattedTime= moment(message.createdAt).format("LT")
    const template=document.querySelector("#message-template" ).innerHTML
    const html= Mustache.render(template,{
        from:message.from,
        text:message.text,
        createdAt:formattedTime
    })
    // console.log(html)
    const div = document.createElement('div')
    div.innerHTML=html
    document.querySelector('#messages').appendChild(div)
    scrollToBottom()
    // const formattedTime= moment(message.createdAt).format("LT")
    // let li = document.createElement("li")
    // li.innerText=`${message.from} ${formattedTime} :${message.text}`
    // document.querySelector('body').appendChild(li)
    // console.log("new message",message)
})
socket.on("updateUsersList",(users)=>{
  console.log("hey")
  console.log(users)
  let ol=document.createElement("ol")

  users.forEach((user)=>{
    let li = document.createElement('li')
    li.innerHTML=user;
    ol.appendChild(li)
  })
  let usersList= document.querySelector("#users")
  usersList.innerHTML=""
  usersList.appendChild(ol)
// console.log(users)
})
socket.on('newLocationMessage', (message) => {
    const formattedTime= moment(message.createdAt).format("LT")
    const template=document.querySelector("#location-message-template" ).innerHTML
    const html= Mustache.render(template,{
        from:message.from,
        url:message.url,
        createdAt:formattedTime
    })
    const div = document.createElement('div')
    div.innerHTML=html
    document.querySelector('#messages').appendChild(div)
    // let li = document.createElement("li")
    // li.innerText=`${message.from} ${formattedTime}`

    // let a=document.createElement("a")
    // a.setAttribute('target','_blank')
    // a.setAttribute('href',message.url)
    // a.innerHTML="my current location"
    // li.append(a)
    // document.querySelector('body').appendChild(li)
    // console.log("new message",message)
})
// socket.emit('createMessage',{
//     from: "shiavaram's server",
//     text: "this should work"
// },function(msg){
//     console.log("server got it",msg)
// })

// socket.emit("createMessage", {
//     from: "shiavaram's server",
//     text: "this should work"
// }, (response) => {
//     console.log(response); // ok
//   })

  document.querySelector("#submit-btn").addEventListener("click",(e)=>{
    e.preventDefault()
    let searchQuery = window.location.search.substring(1);

    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');

    socket.emit("createMessage",{
        from:params.name,
        text:document.querySelector('input[name="message"]').value
    },()=>{

    })
  })

  document.querySelector("#location").addEventListener("click",(e)=>{
    if(!navigator.geolocation){
        return alert("geolocation not supported ")
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit("createLocationMessage",{
            lat:position.coords.latitude,
            lng:position.coords.longitude
        })
    },(err)=>{
        alert("unable to fetch location")
    })

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