console.log(window.location.host)
// var socket = io('wss://'+window.location.host.split(":")[0]+":3000");
const socket = io(nodeUrl.replace("https://", "wss://"));
console.log(socket)
let message_que = []

function send_message_que(){
    // Send an instant message, reset que, then try sending another message
    // console.log(message_que)
    const now = new Date();
    message_que.push({
        'type': 'my_keys',
        'my_name': my_name,
        'keys': [],
        'time': now.getTime(),
        })

    // chat_socket.send(JSON.stringify({'message_que': message_que}));
    if (my_name != undefined){
        socket.emit('message_que', message_que)
    }
    message_que = []
    send_message_que_xhr = setTimeout(function(){
        // console.log("message sent")
        send_message_que()
    }, 50)

}

socket.on('connect', () => {
    console.log('socketio connected')
    send_message_que()
});

// socket.on('blocks', function(data){
//     console.log("received blocks", data)
//     for (id in data['blocks']){
//         // console.log(data['blocks'][id])
//         add_or_change_block(data['blocks'][id])
//     }
// });

socket.on('entity', function(data){
    // console.log("received entity update", data)
    update_entity(data['entity'])
});

socket.on('remove entity', function(data){
    console.log("received remove entity", data)
    remove_entity(data['entity'])
});
