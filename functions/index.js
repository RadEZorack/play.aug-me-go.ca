// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

console.log("Starting Node.JS engine")

var app = require('express')();
const https = require('https');
// const connectDB = require('./config/db');
// const Block = require('./models/Block');
var http = require('http');
const axios = require('axios')
var server = http.Server(app);
var port = 3000;
var django_url = ""
var io = require('socket.io')(server,{
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"]
  }
});

// Connect Database
// connectDB();


// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/public/index.html');
// });

// app.get('/video/', function(req, res){
//   res.sendFile(__dirname + '/public/video.html');
// });

// app.use(express.static(path.join(__dirname, "../public")));

var room_name = "lobby"
var sockets = {}
var socket_names = {}
var entities = {players:{}}
io.on('connection', function(socket){
  sockets[socket.id] = {socket:socket, my_name:undefined, RTCPeerConnection:undefined}

  socket.on('disconnect', (reason) => {
    if (sockets[socket.id].my_name){
      console.log(sockets[socket.id].my_name + " has disconnected", reason)
      io.emit("remove entity", {entity: entities.players["player:"+sockets[socket.id].my_name]})
      delete sockets[socket.id]
    }
  });

  socket.on('chat message', function(msg){
    if (!(socket.id in sockets)){
      return
    }
    io.emit('chat message', msg);
  });

  // Video requests media from room
  socket.on("request-media", data => {
    if (!(socket.id in sockets)){
      return
    }
    // TODO: make api call to see if permissions and room match
    other_socket = socket_names[data.to]
    if (other_socket){
      other_socket.emit("requesting-media", {
         socket: socket.id
      });
    }
   });

  // Video calls room
  socket.on("call-user", data => {
    if (!(socket.id in sockets)){
      return
    }
    socket.to(data.to).emit("call-made", {
      socket: socket.id,
      offer: data.offer,
    });
   });

  // Room answers video
  socket.on("make-answer", data => {
    if (!(socket.id in sockets)){
      return
    }
     socket.to(data.to).emit("answer-made", {
       socket: socket.id,
       answer: data.answer
     });
   });

  // Room talks with video and vice verse
  socket.on("send-candidate", data => {
    if (!(socket.id in sockets)){
      return
    }
      // console.log(data)
     socket.to(data.to).emit("receiving-candidate", {
       socket: socket.id,
       candidate: data.candidate
     });
   });



  socket.on('message_que', function(msg){
    if (!(socket.id in sockets)){
      return
    }
    for (var i in msg){
      var data = msg[i]

      if (data.my_name){
        if (!sockets[socket.id].my_name){
          sockets[socket.id].my_name = data.my_name
          socket_names[data.my_name] = socket
          console.log(data.my_name + " has connected")
        }
        var entity_key = "player:"+data.my_name
        var player = entities.players[entity_key]
        if (!player){
          player = {
            'entity_key': entity_key,
            'x': 0.0,
            'y': 0.0,
            'z': 0.0,
            'rx': 0.0,
            'ry': 0.0,
            'rz': 0.0,
            'keys': {},
            }
        }

        if (data.type == 'push_key'){
          key = data.key
          player.keys[key] = true
        }
        if (data.type == 'release_key'){
          key = data.key
          player.keys[key] = false
        }
        if (data.type == 'my_keys'){
          keys = data.keys
          player.keys = keys
        }
        if (data.type == 'playermove'){
          player.x = data.x
          player.y = data.y
          player.z = data.z
          player.rx = data.rx
          player.ry = data.ry
          player.rz = data.rz
          io.emit("entity", {entity: player})
          // console.log(player)
        }
        if (data.type == 'change_block' || data.type == 'remove_block'){
          console.log('recieved change block', data)
          if (data.type == "remove_block"){
            material = ""
            block_key = data.key
            key_split = block_key.split(':')[2].split(",")
            x = parseFloat(key_split[0])
            y = parseFloat(key_split[1])
            z = parseFloat(key_split[2])
          }else{
            material = data.material
            x = parseFloat(Math.floor(parseFloat(data.x)))
            y = parseFloat(Math.floor(parseFloat(data.y)))
            z = parseFloat(Math.floor(parseFloat(data.z)))
            block_key = room_name + ":block:"+x.toFixed(1)+","+y.toFixed(1)+","+z.toFixed(1)
          }

          axios.get(django_url+"api/blocks/?key="+block_key)
            .then((resp) => {
              console.log('Trying to fetch', django_url+"api/blocks/?key="+block_key)
                console.log(resp.data);
                if (resp.data.length){
                  id = resp.data[0].id
                  block = resp.data[0]
                  old_material = block.material
                  block.material = material
                  // We need to PUT
                  axios.put(django_url+"api/blocks/"+id+"/", block)
                    .then((returned_resp) => {
                      console.log(returned_resp.data);
                    })
                    .catch((error) => {
                      console.error(error)
                    })
                  block.old_material = old_material
                }else{
                  // We need to create
                  // Use terrain generation to find old material
                  if(y==0){
                    old_material="grass"
                  }else{
                    old_material=""
                  }
                  block = {
                    "key": block_key,
                    "x": x,
                    "y": y,
                    "z": z,
                    "material": material,
                    "old_material": old_material
                  }
                  axios.post(django_url+"api/blocks/", block)
                    .then((returned_resp) => {
                      console.log(returned_resp.data);
                    })
                    .catch((error) => {
                      console.error(error)
                    })
                }

                io.emit("blocks", {blocks: [block]})
            })
            .catch((error) => {
              console.error(error)
            })
        }
        entities.players[entity_key] = player
      }
    }
  });
});


server.listen(port, function(){
  console.log('listening on *:' + port);
});

