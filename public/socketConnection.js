// console.log(window.location.host)
// var socket = io('wss://'+window.location.host.split(":")[0]+":3000");
// const socket = io(nodeUrl.replace("https://", "wss://"));
// console.log(socket)
// let message_que = []


// Get a reference to the database service

const myR = Math.random()
const myG = Math.random()
const myB = Math.random()

function start_message_que(){
    database.ref('userInput/'+myUid).set({
        'type': 'playermove',
        'uid': myUid,
        'my_name': my_name,
        'r': myR,
        "g": myG,
        "b": myB,
        'x': 0,
        'y': 0,
        'z': 0,
        'rx': 0,
        'ry': 0,
        'rz': 0,
        'px': 0,
        'py': 0,
        'pz': 0,
        'prx': 0,
        'pry': 0,
        'prz': 0,
        'time': now.getTime(),
    })
    send_message_que();
}

function send_message_que(){
    if (myUid in entities && 'gltf' in entities[myUid] && my_name != null){
        let my_player = entities[myUid]['gltf'].scene;

        database.ref('userInput/'+myUid).set({
            'type': 'playermove',
            'uid': myUid,
            'my_name': my_name,
            'r': myR,
            "g": myG,
            "b": myB,
            'x': window.camera.position.x,
            'y': window.camera.position.y,
            'z': window.camera.position.z,
            'rx': window.camera.rotation.x,
            'ry': window.camera.rotation.y,
            'rz': window.camera.rotation.z,
            'px': my_player.position.x,
            'py': my_player.position.y,
            'pz': my_player.position.z,
            'prx': my_player.rotation.x,
            'pry': my_player.rotation.y,
            'prz': my_player.rotation.z,
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
