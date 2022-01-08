// console.log(window.location.host)
// var socket = io('wss://'+window.location.host.split(":")[0]+":3000");
// const socket = io(nodeUrl.replace("https://", "wss://"));
// console.log(socket)
// let message_que = []


// Get a reference to the database service


function send_message_que(){

    if (my_name != null){
        database.ref('userInput/'+myUid).set({
            'type': 'playermove',
            'uid': myUid,
            'my_name': my_name,
            'x': window.camera.position.x,
            'y': window.camera.position.y,
            'z': window.camera.position.z,
            'rx': window.camera.rotation.x,
            'ry': window.camera.rotation.y,
            'rz': window.camera.rotation.z,
            'time': now.getTime(),
        })
        
    }

    send_message_que_xhr = setTimeout(function(){
        // console.log("message sent")
        send_message_que()
    }, 100)

}


// socket.on('connect', () => {
//     console.log('socketio connected')
//     send_message_que()
// });

// socket.on('blocks', function(data){
//     console.log("received blocks", data)
//     for (id in data['blocks']){
//         // console.log(data['blocks'][id])
//         add_or_change_block(data['blocks'][id])
//     }
// });

// socket.on('entity', function(data){
//     // console.log("received entity update", data)
//     update_entity(data['entity'])
// });

// socket.on('remove entity', function(data){
//     console.log("received remove entity", data)
//     remove_entity(data['entity'])
// });
