async function connectWebRTC(userTo){
  // Connect myself to the User I am trying to load.
  console.log('connectWebRTC')
  const userFrom = myUid;

  // Start Send events
  database.ref(`/userTo/${userTo}/userFrom/${userFrom}`).update({
      userTo: userTo,
      userFrom: userFrom,
  });
  
  // Basic Config
  let configuration = {
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
  let peerConnectionReceive = new RTCPeerConnection(configuration);

  // Start receiving and sending Ice Candidates
  // peerConnection.onicecandidate = async function(event) {
  //   console.log("Recieve: onicecandidate")
  //   if (event.candidate) {
  //     // Send the candidate to the remote peer
  //     database.ref(`/userTo/${userTo}/userFrom/${userFrom}/messages/${Date.now()}`).update({
  //       type: "candidate",
  //       userTo: userTo,
  //       userFrom: userFrom,
  //       candidate: event.candidate,
  //     })
  //   } else {
  //     // All ICE candidates have been sent
  //   }
  // }

  // Listen to Negotiate events
  // peerConnection.onnegotiationneeded = async function(){
  //   console.log("Recieve: renegotiating")
  //   peerConnection.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true,}).then(function(offer) {
  //       return peerConnection.setLocalDescription(offer);
  //     })
  //     .then(async function() {
  //       // Send new localDescription
  //       database.ref(`/userTo/${userTo}/userFrom/${userFrom}/messages/${Date.now()}`).update({
  //         type: "offer",
  //         userTo: userTo,
  //         userFrom: userFrom,
  //         offer: peerConnection.localDescription
  //       })
  //     })
  //     .catch(function(err){
  //       console.log(err)
  //     });
  // };

  // Recieve the video and audio
  peerConnectionReceive.ontrack = function(event) {
      console.log("received media", event)
     const remoteVideo = document.getElementById(`remote-video-${userTo}`);
     remoteVideo.onloadedmetadata = function(e) {
        remoteVideo.play();
      };
     console.log(remoteVideo)
     if (remoteVideo) {
       remoteVideo.srcObject = event.streams[0];
       console.log(remoteVideo, remoteVideo.srcObject)

     }
  };

  // Crunch messages
  async function crunchMessages2(message){
    console.log("message 2")
    message = message.val();
    console.log(message)
    if (message.type == "offer"){
      console.log("setting offer")
      await peerConnectionReceive.setRemoteDescription(
          new RTCSessionDescription(message.offer)
      );

      console.log("creating answer")
      const answer = await peerConnectionReceive.createAnswer();
      await peerConnectionReceive.setLocalDescription(
          new RTCSessionDescription(answer)
      );
      console.log("sending answer")
      database.ref(`/userTo/${userTo}/userFrom/${userFrom}/messages/${Date.now()}`).update({
          type: "answer",
          userTo: userTo,
          userFrom: userFrom,
          answer: peerConnectionReceive.localDescription,
      });
    }else if(message.type == "candidate"){
      console.log("receiving-candidate 2")
      const candidate = new RTCIceCandidate(message.candidate);
      peerConnectionReceive.addIceCandidate(candidate,
        function(){},
        function(error){console.log('error',error)}
      )
    }
  } 
  
  // Cunch qued messages
  database.ref(`/userTo/${userFrom}/userFrom/${userTo}/messages`).once('value', async (messages) =>{
    messages.forEach((message) => {
      crunchMessages2(message)
    })
  })
  // Listen for messages coming to us.
  database.ref(`/userTo/${userFrom}/userFrom/${userTo}/messages`).on('child_added', async (message) =>{
    crunchMessages2(message);
  })
}