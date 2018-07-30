require("dotenv").config();
const Pusher = require("pusher");
const express = require('express')
const User = require('../models/user')

const router = express.Router()








onlineUsers = []

const pusher = new Pusher({
    appId: `${process.env.PUSHER_APP_ID}`,
    key: `${process.env.PUSHER_API_KEY}`,
    secret: `${process.env.PUSHER_API_SECRET}`,
    cluster: `${process.env.PUSHER_APP_CLUSTER}`,
    encrypted: true
});


//// get all users//////////////

setInterval(() => {
    User.find({},(err,user)=>{
        for(i = 0; i < user.length; i++)
        {   
            
            user[i].online = false
            console.log(user[i].online + "yo")
            user[i].save()
        }    
    });


    pusher.trigger("events-channel", 'test-still-online-channel',{
        msg:"test chanel"
        })
        UpdateOnlineUser()
}, 5000)



UpdateOnlineUser = ()=>{
    setInterval(() => {
        User.find({},(err,users)=>{
            pusher.trigger("events-channel", 'update-online-users-channel',{
                users:users
                })
        })  
    }, 3000)
}




router.get("/getonline", function(req, res){  
    User.find({},(err,users)=>{
         res.json(users)
    })
});



router.put('/stillonline',(req,res)=>{
    console.log("still online poart")
    User.findById(req.body.id,(err,user)=>{
        user.online = true
        console.log(user.firstname + " " + user.online)
        user.save()
    })
    res.json("yo")
})




//////////////send and recive msgs
router.post("/message", function(req, res){
    console.log(req.body)
    pusher.trigger('events-channel', 'new-msg', {
     chat:req.body 
    });
  res.json("msg")
});
///////////////////////////


////////////////send and recive likes
router.post("/update", function(req, res){
    pusher.trigger('events-channel', "presence-new-like", {
     likes: {likes : req.body.likes}
    });
    res.json("like")
});

/////////////////////////


module.exports =  router
