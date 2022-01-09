async function initWebRTC(){
  // A wrapper to let the firebase intialize
  database.ref(`/userTo/${myUid}/userFrom/`).on('child_added', async (data) => {
    // A NEW USER has joined the server
    console.log('child_added')
    data = data.val()

    // Set the sender to the receiver
    const userTo = data.userFrom;
    // Set myself to the sender
    const userFrom = myUid;

    // We should not be sending to ourselves
    if (userTo == null || userTo == myUid){
      return;
    }

    // Basic config
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
      entities[userTo]["peerConnectionSend"] = new RTCPeerConnection(configuration);
      let peerConnectionSend = entities[userTo]["peerConnectionSend"]

    // Start receiving and sending Ice Candidates
    peerConnectionSend.onicecandidate = async function(event) {
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
    peerConnectionSend.onnegotiationneeded = async function(){
      console.log("Send: renegotiating")
      peerConnectionSend.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true,}).then(function(offer) {
          return peerConnectionSend.setLocalDescription(offer);
        })
        .then(async function() {
          // Send new localDescription
          database.ref(`/userTo/${userTo}/userFrom/${userFrom}/messages/${Date.now()}`).update({
            type: "offer",
            userTo: userTo,
            userFrom: userFrom,
            offer: peerConnectionSend.localDescription
          })
        })
        .catch(function(err){
          console.log(err)
        });
    };
      
    // Send the Video and Audio tracks
    async function sendChannels(){
      navigator.getUserMedia({ video: true, audio: true }, async stream => {
        console.log(peerConnectionSend, stream, stream.getTracks())
        stream.getTracks().forEach(async track => {
          console.log("sending tracks", track)
          peerConnectionSend.addTrack(track, stream)
        });
      }, error => {
          console.warn(error.message);
        }
      );
    }

    sendChannels();
    
    
    // Start: RTCPeerConnection.signalingState = stable
    // Create a Local Offer
    if (peerConnectionSend.iceConnectionState == "new" || peerConnectionSend.iceConnectionState == 'checking'){
      const offer = await peerConnectionSend.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true,});
      await peerConnectionSend.setLocalDescription(
        new RTCSessionDescription(offer)
      );
      // RTCPeerConnection.signalingState = have-local-offer
    
      // Send new localDescription
      database.ref(`/userTo/${userTo}/userFrom/${userFrom}/messages/${Date.now()}`).update({
        type: "offer",
        userTo: userTo,
        userFrom: userFrom,
        offer: peerConnectionSend.localDescription
      });
    }

    // Crunch messages
    // let finalStop = false;
    async function crunchMessages(message){
      console.log("message 1")
      message = message.val();
      console.log(message)
      if(message.type == "answer"){
        console.log("setting answer", peerConnectionSend.iceConnectionState, peerConnectionSend.signalingState)
        if ((peerConnectionSend.iceConnectionState == 'connected' || peerConnectionSend.iceConnectionState == 'disconnected') && peerConnectionSend.signalingState == "stable"){
          console.log("bypass");
        }else{
          peerConnectionSend.setRemoteDescription(
            new RTCSessionDescription(message.answer)
          ).catch(function(err){
            console.log(err)
          });
        }
        console.log("Final Success!")
        // .then(function(){
        //   finalStop = true;
        //   console.log("Final Success!")
        // }).catch(function(err){
        //   console.log("Restarting Ice")
        //   if (finalStop == false){
        //     peerConnectionSend.restartIce();
        //   }
        // });
      }
      else if(message.type == "candidate"){
        console.log("receiving-candidate 1")
        const candidate = new RTCIceCandidate(message.candidate);
        await peerConnectionSend.addIceCandidate(candidate,
          function(){},
          function(error){console.log('error',error)}
        )
      }
    }

    database.ref(`/userTo/${userFrom}/userFrom/${userTo}/messages`).once("value", async (messages) => {
      messages.forEach((message) => {
        crunchMessages(message)
      })
    })
    // Listen for messages coming to us.
    database.ref(`/userTo/${userFrom}/userFrom/${userTo}/messages`).on("child_added", async (message) => {
      crunchMessages(message)
    })
  });
}