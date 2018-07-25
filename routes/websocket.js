require("dotenv").config();
const Pusher = require("pusher");
const express = require('express')
const User = require('../models/user')

const router = express.Router()








users = []

const pusher = new Pusher({
    appId: `${process.env.PUSHER_APP_ID}`,
    key: `${process.env.PUSHER_API_KEY}`,
    secret: `${process.env.PUSHER_API_SECRET}`,
    cluster: `${process.env.PUSHER_APP_CLUSTER}`,
    encrypted: true
});


//// get all users//////////////
router.get("/getonline", function(req, res){  
    User.find({},(err,users)=>{
         res.json(users)
    })
});
//////////////////////////////////////

/////// tell all users you are online
router.post("/online", function(req, res){
    console.log("im now online" + req.body.id)
    User.findById(req.body.id, (err,user)=>{
        user.online = true
        user.save(()=>{
        pusher.trigger("events-channel", 'user-went-online',{
        user
   })
        res.json(user.firstname + "is Online")
        })
})
});
////////////////////////////


///////////////logs off user when he signs out ///////////////////

router.put("/offline", function(req, res){


    User.findById(req.body.id, (err,user)=>{
        console.log(user + 'now off')
        user.online = false;
        user.save(()=>{
            pusher.trigger("events-channel", 'user-logged-out',{
            user
            }
        )
        })
 
    })
 });
////////////////////////////////////////////////////////////////


////////////////logs off user when he closses the browser/////////////////////////
router.put("/disconnect", function(req, res){
    User.findById(req.body.id, (err,user)=>{
        user.online = false;
        user.save(()=>{
            pusher.trigger("events-channel", 'user-logged-out',{
            user
            }
        )
        })
    })
});
///////////////////////////////////////////////////////////////////////////////////////


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


module.exports = {users:users, router: router}
