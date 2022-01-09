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
    let peerConnection = new RTCPeerConnection(configuration)

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
          database.ref(`/userTo/${userTo}/userFrom/${userFrom}/messages/${Date.now()}`).update({
            type: "offer",
            userTo: userTo,
            userFrom: userFrom,
            offer: peerConnection.localDescription
          })
        })
        .catch(function(err){
          console.log(err)
        });
    };
      
    // Send the Video and Audio tracks
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
    const offer = await peerConnection.createOffer({offerToReceiveAudio: true, offerToReceiveVideo: true,});
    await peerConnection.setLocalDescription(
      new RTCSessionDescription(offer)
    );
    // RTCPeerConnection.signalingState = have-local-offer

    // Send new localDescription
    database.ref(`/userTo/${userTo}/userFrom/${userFrom}/messages/${Date.now()}`).update({
      type: "offer",
      userTo: userTo,
      userFrom: userFrom,
      offer: peerConnection.localDescription
    });

    // Crunch messages
    async function crunchMessages(message){
      console.log("message 1")
      message = message.val();
      console.log(message)
      if(message.type == "answer"){
        console.log("setting answer")
        peerConnection.setRemoteDescription(
          new RTCSessionDescription(message.answer)
        );
      }
      else if(message.type == "candidate"){
        console.log("receiving-candidate 1")
        const candidate = new RTCIceCandidate(message.candidate);
        await peerConnection.addIceCandidate(candidate,
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