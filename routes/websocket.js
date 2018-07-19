require("dotenv").config();
const Pusher = require("pusher");
const express = require('express')

const router = express.Router()


users = []

const pusher = new Pusher({
    appId: `${process.env.PUSHER_APP_ID}`,
    key: `${process.env.PUSHER_API_KEY}`,
    secret: `${process.env.PUSHER_API_SECRET}`,
    cluster: `${process.env.PUSHER_APP_CLUSTER}`,
    encrypted: true
});


router.get("/getonline", function(req, res){
  res.json(users)
});


router.put("/offline", function(req, res){

    for(i = 0; i < users.length; i++)
    {
        if(users[i].firstname == req.body.firstname)
        {   
            let theUser = users[i]
            console.log("removing " + req.body.firstname)
            users.splice(i,1)
            pusher.trigger("events-channel", 'user-offline',
              theUser
            )
        }
    }

  });

router.post("/online", function(req, res){

    shouldAdd = true;
    console.log(req.body)
    for(i = 0; i < users.length; i ++)
    {   
        console.log(users[i].firstname +  req.body.firstname)

       if(users[i].firstname == req.body.firstname)
       {    

           console.log("should not add ")
           shouldAdd = false
       }
    }

    if(shouldAdd)
    {   
        console.log("should  add ")
        users.push(req.body)
        
        pusher.trigger("events-channel", 'user-online', 
        req.body 
       );
    }
  res.json(req.body + " is online")
});


router.post("/message", function(req, res){
    console.log(req.body)
    pusher.trigger("events-channel", 'new-msg', {
     chat:req.body 
    });
  res.json("msg")
});


router.post("/update", function(req, res){
    pusher.trigger("events-channel", "new-like", {
     likes: {likes : req.body.likes}
    });
    res.json("like")
});


module.exports = router