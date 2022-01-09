async function connectWebRTC(userTo){
  // Connect myself to the User I am trying to load.
  console.log('connectWebRTC')
  const userFrom = myUid;

  // Start Send events
  // database.ref(`/userTo/${userTo}/userFrom/${userFrom}`).update({
  //     userTo: userTo,
  //     userFrom: userFrom,
  // });
  
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

  
  let peerConnection = new RTCPeerConnection(configuration);
  entities[userTo]["peerConnection"] = peerConnection

  // Start receiving and sending Ice Candidates
  peerConnection.onicecandidate = async function(event) {
    console.log("Send: onicecandidate")
    if (event.candidate) {
      // Send the candidate to the remote peer
      database.ref(`/userTo/${userTo}/userFrom/${userFrom}/messages/${Date.now()}`).update({
        type: "candidate",
        userTo: userTo,
        userFrom: userFrom,
        candidate: event.candidate,
      })
    } else {
      // All ICE candidates have been sent
    }
  }

  // Listen to Negotiate events
  peerConnection.onnegotiationneeded = async function(){
    console.log("Send: renegotiating")
    peerConnection.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true,}).then(function(offer) {
        return peerConnection.setLocalDescription(offer);
      })
      .then(async function() {
        // Send new localDescription
        database.ref(`/userTo/${userTo}/userFrom/${userFrom}`).update({
          offer: peerConnection.localDescription
        })
      })
      .catch(function(err){
        console.log(err)
      });
  };

  // Recieve the video and audio
  peerConnection.ontrack = function(event) {
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

  navigator.getUserMedia({ video: true, audio: true }, async stream => {
    console.log(peerConnection, stream, stream.getTracks())
    stream.getTracks().forEach(async track => {
      console.log("sending tracks", track)
      peerConnection.addTrack(track, stream)
    });
  }, error => {
      console.warn(error.message);
    }
  );

  // Start: RTCPeerConnection.signalingState = stable
  // Create a Local Offer
  if(userFrom < userTo){
    console.log("getting offers")
    database.ref(`/userTo/${userFrom}/userFrom/${userTo}/offer`).on('value', async (data) => {
      offer = data.val()
      console.log("offer", offer)
      if(offer != null){
        console.log("setting offer")
        await peerConnection.setRemoteDescription(
            new RTCSessionDescription(offer)
        );

        console.log("creating answer")
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(
            new RTCSessionDescription(answer)
        );
        console.log("sending answer")
        database.ref(`/userTo/${userTo}/userFrom/${userFrom}`).update({
            answer: peerConnection.localDescription,
        });
      }
    })
  }else{
    console.log("sending offers")
    const offer = await peerConnection.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true,});
    await peerConnection.setLocalDescription(
      new RTCSessionDescription(offer)
    );
    // RTCPeerConnection.signalingState = have-local-offer

    // Send new localDescription offer
    database.ref(`/userTo/${userTo}/userFrom/${userFrom}`).update({
      offer: peerConnection.localDescription
    });

    database.ref(`/userTo/${userFrom}/userFrom/${userTo}/answer`).on('value', async (data) => {
      answer = data.val()
      console.log('answer', answer)
      peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      ).catch(function(err){
        console.log(err)
      })
    })
  }

  // Crunch messages
  async function crunchMessages(message){
    console.log("message")
    message = message.val();
    console.log(message)
    if(message.type == "candidate"){
      console.log("receiving-candidate")
      const candidate = new RTCIceCandidate(message.candidate);
      peerConnection.addIceCandidate(candidate,
        function(){},
        function(error){console.log('error',error)}
      )
    }
  } 
  
  // Cunch qued messages
  database.ref(`/userTo/${userFrom}/userFrom/${userTo}/messages`).once('value', async (messages) =>{
    messages.forEach((message) => {
      crunchMessages(message)
    })
  })
  // Listen for messages coming to us.
  database.ref(`/userTo/${userFrom}/userFrom/${userTo}/messages`).on('child_added', async (message) =>{
    crunchMessages(message);
  })
}