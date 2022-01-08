// const { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } = window;
let peerConnections = {}

async function initWebRTC(){
  database.ref(`/userTo/${myUid}/userFrom/`).on('child_added', async (data) => {
    console.log('child_added')
      data = data.val()
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

      let iceCount = 0;
      peerConnection.onicecandidate = function(event) {
          console.log("onicecandidate", event)
        if (event.candidate) {
          // Send the candidate to the remote peer
          database.ref(`/userTo/${data.from}/userFrom/${myUid}/userToCandidate/${iceCount}`).update({
            to: data.from,
            from: myUid,
            candidate: event.candidate,
          })
          
          // socket.emit("send-candidate", {
          //   candidate: event.candidate,
          //   to: data.socket
          // });
          iceCount += 1;
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
              database.ref(`/userTo/${data.from}/userFrom/${myUid}`).update({
                to: data.from,
                from: myUid,
                offer: peerConnection.localDescription,
                answer: null,
              })
              // socket.emit("call-user", {
              // offer: peerConnection.localDescription,
              // to: data.socket
            // });
            })
            .catch(function(err){
              console.log(err)
            });
      };
      peerConnections[data.from] = peerConnection

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
      // socket.emit("call-user", {
      //     offer: peerConnection.localDescription,
      //     to: data.socket
      //   });

      database.ref(`/userTo/${data.from}/userFrom/${myUid}`).update({
        to: data.from,
        from: myUid,
        offer: peerConnection.localDescription,
      })

      // socket.emit("make-answer", {
      //   answer: peerConnection.localDescription,
      //   to: data.socket
      // });
  

      function handleNegotiationNeededEvent(peerConnection, to_socket) {
        peerConnection.createOffer().then(function(offer) {
          return peerConnection.setLocalDescription(offer);
        })
        .then(function() {
          // socket.emit("call-user", {
          // offer: peerConnection.localDescription,
          // to: to_socket
          // });
          database.ref(`/userTo/${data.from}/userFrom/${myUid}`).update({
            to: data.from,
            from: myUid,
            offer: peerConnection.localDescription,
            answer: null,
          })
        })
        .catch(function(err){
          console.log(err)
        });
      }

      // socket.on("answer-made", async data => {
        database.ref(`/userTo/${myUid}/userFrom/${data.from}/`).on('value', async (snapshot) => {
          
          snapshot = snapshot.val();
          if ( snapshot.answer != null){
            console.log("answer-made")
            await database.ref(`/userTo/${myUid}/userFrom/${data.from}/`).update({
              offer: null,
              answer: null
            })
            console.log("snapshot.answer", snapshot)
            let peerConnection = peerConnections[data.from]
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(snapshot.answer)
            );
          }
        })
        
      // })

      // socket.on("receiving-candidate", data => {
      database.ref(`/userTo/${myUid}/userFrom/${data.from}/userToCandidate/`).on("child_added", async (snapshot) => {
          snapshot = snapshot.val();  
          console.log("receiving-candidate", snapshot)

          let peerConnection = peerConnections[data.from]
          const candidate = new RTCIceCandidate(snapshot.candidate);
          peerConnection.addIceCandidate(candidate, function(){console.log('success')}, function(error){console.log('error',error)})
      })
  });
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
}
