require("dotenv").config();
const Pusher = require("pusher");
const express = require('express')

const router = express.Router()




const pusher = new Pusher({
    appId: `${process.env.PUSHER_APP_ID}`,
    key: `${process.env.PUSHER_API_KEY}`,
    secret: `${process.env.PUSHER_API_SECRET}`,
    cluster: `${process.env.PUSHER_APP_CLUSTER}`,
    encrypted: true
});

router.post("/message", function(req, res){
    console.log(req.body)
    pusher.trigger("events-channel", 'new-msg', {
     chat:req.body 
    });
  
});


router.post("/update", function(req, res){
    pusher.trigger("events-channel", "new-like", {
     likes: {likes : req.body.likes}
    });
});


module.exports = router