const { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } = window;
let peerConnections = {}

socket.on("requesting-media", async data => {
    const configuration = {
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
      iceServers: [     // Information about ICE servers - Use your own!
        {
          'urls':'stun:stun.l.google.com:19302'
        },{
          'urls':'stun:stun1.l.google.com:19302'
        },{
          'urls':'stun:stun2.l.google.com:19302'
        },{
          'urls':'stun:stun3.l.google.com:19302'
        },{
          'urls':'stun:stun4.l.google.com:19302'
        }
      ]};
 const peerConnection = new RTCPeerConnection(configuration)

 peerConnection.onicecandidate = function(event) {
    console.log("onicecandidate", event)
  if (event.candidate) {
    // Send the candidate to the remote peer
    socket.emit("send-candidate", {
       candidate: event.candidate,
       to: data.socket
     });
  } else {
    // All ICE candidates have been sent
  }
 }
 peerConnection.onnegotiationneeded = function(){
    console.log("renegotiating")
    peerConnection.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true,}).then(function(offer) {
        return peerConnection.setLocalDescription(offer);
      })
      .then(function() {
        socket.emit("call-user", {
         offer: peerConnection.localDescription,
         to: data.socket
       });
      })
      .catch(function(err){
        console.log(err)
      });
 };
 peerConnections[data.socket] = peerConnection

 await navigator.getUserMedia(
 { video: true, audio: true },
 async stream => {
    console.log(peerConnection, stream, stream.getTracks())
   await stream.getTracks().forEach(async track => {
    console.log("sending tracks", track)
    await peerConnection.addTrack(track, stream)
   });
 },
 error => {
   console.warn(error.message);
 }
);
 // const answer = await peerConnection.createAnswer();
 const offer = await peerConnection.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true,});
 await peerConnection.setLocalDescription(
   new RTCSessionDescription(offer)
 );
 // await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
 socket.emit("call-user", {
     offer: peerConnection.localDescription,
     to: data.socket
   });

 // socket.emit("make-answer", {
 //   answer: peerConnection.localDescription,
 //   to: data.socket
 // });
});

function handleNegotiationNeededEvent(peerConnection, to_socket) {
  peerConnection.createOffer().then(function(offer) {
    return peerConnection.setLocalDescription(offer);
  })
  .then(function() {
    socket.emit("call-user", {
     offer: peerConnection.localDescription,
     to: to_socket
   });
  })
  .catch(function(err){
    console.log(err)
  });
}

socket.on("answer-made", async data => {
  console.log("answer-made")
  let peerConnection = peerConnections[data.socket]
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.answer)
  );
})

socket.on("receiving-candidate", data => {
    console.log("receiving-candidate", data)
    let peerConnection = peerConnections[data.socket]
    const candidate = new RTCIceCandidate(data.candidate);
    peerConnection.addIceCandidate(candidate, function(){console.log('success')}, function(error){console.log('error',error)})
})

// socket.on("requesting-media", data => {
//     console.log("sending media to", data.socket)
//     let peerConnection = peerConnections[data.socket]
//     navigator.getUserMedia(
//      { video: true, audio: true },
//      stream => {
//         console.log(peerConnection, stream, stream.getTracks())
//        stream.getTracks().forEach(track => {
//         console.log("sending tracks", track)
//         peerConnection.addTrack(track, stream)
//        });
//      },
//      error => {
//        console.warn(error.message);
//      }
//     );
// })
