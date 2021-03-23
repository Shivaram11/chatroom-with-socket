class Users{
    constructor(){
        this.users=[]
    }
    addUser(id,name,room){
        let user ={id,name,room}
        this.users.push(user)
        return user
    }
    getUserList (room) {
        // console.log("before",this.users)
        console.log(this.users)
        let users = this.users.filter((user) => user.room === room);
        let namesArray = users.map((user) => user.name);
        // console.log("after",namesArray)
        return namesArray;
      }
    getUser(id){
        
        return this.users.filter((user)=>{
           return user.id===id
        })[0]
    }
    removeUser(id){
        let user = this.getUser(id)
        // console.log("id=",id)
        if(user){
            this.users=this.users.filter((user)=>{
              return  user.id!==id
            })
        }
   
        return user
    }
}
module.exports={Users}