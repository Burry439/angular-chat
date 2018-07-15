const cors = require("cors");
const Pusher = require("pusher");
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');



const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


const port = require("dotenv").config() || 8080;

const pusher = new Pusher({
    appId: `${process.env.PUSHER_APP_ID}`,
    key: `${process.env.PUSHER_API_KEY}`,
    secret: `${process.env.PUSHER_API_SECRET}`,
    cluster: `${process.env.PUSHER_APP_CLUSTER}`,
    encrypted: true
});





app.post("/message", function(req, res){
    console.log(req.body)
    pusher.trigger("events-channel", 'new-msg', {
     chat:req.body 
    });
  
});


app.post("/update", function(req, res){
    pusher.trigger("events-channel", "new-like", {
     likes: {likes : req.body.likes}
    });
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });


    app.listen(port);
    console.log("Listening on localhost:8080");