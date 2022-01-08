var entities = {}
var my_position = undefined
// Instantiate a loader
var gltf_loader = new THREE.GLTFLoader();
const { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } = window;

async function connectWebRTC(uid){
    console.log('connectWebRTC')
    var configuration = {
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
      var peerConnection =  new RTCPeerConnection(configuration);
  
      peerConnection.ontrack = function(event) {
        console.log("received media", event)
       const remoteVideo = document.getElementById(`remote-video-${uid}`);
       remoteVideo.onloadedmetadata = function(e) {
          remoteVideo.play();
        };
       console.log(remoteVideo)
       if (remoteVideo) {
         remoteVideo.srcObject = event.streams[0];
         console.log(remoteVideo, remoteVideo.srcObject)
  
       }
      };
      console.log(peerConnection)
  
      async function callUser() {
        console.log("calling:", uid)
        // socket.emit("request-media", {
        //      to: uid,
        //      from: myUid
        //    });

        await database.ref(`/userTo/${uid}/userFrom/${myUid}`).update({
            to: uid,
            from: myUid,
            offer: null,
            answer: null,
        });
        //  const offer = await peerConnection.createOffer({offerToReceiveAudio: true,
        // offerToReceiveVideo: true,});
        //  await peerConnection.setLocalDescription(new RTCSessionDescription(offer));
        // console.log("calling user")
        //  socket.emit("call-user", {
        //    offer,
        //    name: urlParams.get('name')
        //  });
      }
      callUser()
  
    //   socket.on("call-made", async data => {
        database.ref(`/userTo/${myUid}/userFrom/${uid}`).on('value', async (data) =>{
            data = data.val()
            if (data.offer != null && data.answer == null){
                console.log("call-made")
                await database.ref(`/userTo/${myUid}/userFrom/${uid}/`).update({
                    offer: null,
                    answer: null
                  })
                console.log("data.offer", data)
                await peerConnection.setRemoteDescription(
                    new RTCSessionDescription(data.offer)
                );
                let iceCount = 0;
                peerConnection.onicecandidate = function(event) {
                    console.log("onicecandidate", event)
                    if (event.candidate) {
                        // Send the candidate to the remote peer
                        database.ref(`/userTo/${uid}/userFrom/${myUid}/userToCandidate/${iceCount}`).set({
                            candidate: event.candidate,
                        })
                        iceCount += 1;
                        // socket.emit("send-candidate", {
                        //     candidate: event.candidate,
                        //     to: data.socket
                        // });
                    } else {
                    // All ICE candidates have been sent
                    }
                }
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(
                    new RTCSessionDescription(answer)
                );
                // socket.emit("request-media", {
                //   to: data.socket
                // });
                database.ref(`/userTo/${uid}/userFrom/${myUid}/`).update({
                    to: uid,
                    from: myUid,
                    offer: null,
                    answer: peerConnection.localDescription
                });
            }
            
       })
       // peerConnection.icegatheringstatechange = function(event) {
       //  console.log(event)
       // }
  
       // if (!isAlreadyCalling) {
       //   callUser(data.socket);
       //   isAlreadyCalling = true;
       // }
       
        //    socket.emit("make-answer", {
        //      ,
        //      to: data.socket
        //    });
  
        //   socket.on("receiving-candidate", data => {
        database.ref(`/userTo/${myUid}/userFrom/${uid}/userToCandidate/`).on('child_added', (data) => {
            data = data.val();
            console.log("receiving-candidate", data)
          let candidate = new RTCIceCandidate(data.candidate);
          peerConnection.addIceCandidate(candidate,
            function(){console.log('success')},
            function(error){console.log('error',error)})
        })
}

// // Optional: Provide a DRACOLoader instance to decode compressed mesh data
var dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath( "{% static 'chat/js/threejs/examples/js/libs/draco/' %}" );
gltf_loader.setDRACOLoader( dracoLoader );
function update_entity(entity_data){
    let entity_key = entity_data['uid']
    let x = entity_data['x']
    let y = entity_data['y']
    let z = entity_data['z']
    let rx = entity_data['rx']
    let ry = entity_data['ry']
    let rz = entity_data['rz']
    let animation = entity_data['animation']

    if (entity_key == "player:"+my_name){
        // if (my_position == undefined || Math.sqrt((my_position.x - x)**2 + (my_position.y - y)**2 + (my_position.z - z)**2) >= 0.9){
        //     // Player has either started or cheated or moved up a block
        // }
        if (my_position == undefined){
            // Player has started
            my_position = new THREE.Vector3(x, y, z)
            // camera.position.set( x, y, z );
        }
        // console.log(rx, ry, rz )
        // camera.rotation.set( rx, ry - Math.PI, rz );

    }else if (!(entity_key in entities)){
        entities[entity_key] = "loading"
        console.log("new entity", entity_key, entities)
        const page = create3dPage(
            // 1.5m wide
          300, 300,
          0.005,
          new THREE.Vector3(x, y+1.2, z),
          new THREE.Vector3(0, ry, 0),
          "",
          `<div class="video-container" style="width: 300px; height: 300px; background-color: black;">
            <div style="position: absolute; top: 5px; left: 50%; transform: translate(-50%, 0);">Temporary</div>
            <video autoplay class="remote-video" id="remote-video-${entity_key}" style="max-width: 100%; max-height: 100%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></video>
          </div>`
          );
        // entities[entity_key] = {
        //             'plane': page.plane,
        //             'cssobject': page.cssObject
        // }
        connectWebRTC(entity_key);

        gltf_loader.load(
            // resource URL
            cesiumManUrl,
            // called when the resource is loaded
            function ( gltf ) {
                console.log('gltf', gltf)
                window.scene.add( gltf.scene );


                entities[entity_key] = {
                    'gltf': gltf,
                    'plane': page.plane,
                    'cssObject': page.cssObject,
                    'mixer': new THREE.AnimationMixer(gltf.scene),
                    'animation': 0,
                }
                console.log("passed")

                gltf.scene.position.x = x
                gltf.scene.position.y = y - 1.1
                gltf.scene.position.z = z

                // gltf.scene.rotation.x = rx
                gltf.scene.rotation.y = ry
                // gltf.scene.rotation.z = rz
                // gltf.scene.rotateY(Math.PI/2) // flip around
                // gltf.scene.rotation.x = 0
                // gltf.scene.rotation.z = 0

                gltf.scene.scale.x = 1
                gltf.scene.scale.y = 1
                gltf.scene.scale.z = 1

                // plane.translateZ(-50)
                // plane.translateY(325)

                // cssobject.translateZ(-50)
                // cssobject.translateY(325)

                // gltf.animations; // Array<THREE.AnimationClip>
                // gltf.scene; // THREE.Group
                // gltf.scenes; // Array<THREE.Group>
                // gltf.cameras; // Array<THREE.Camera>
                // gltf.asset; // Object
                console.log("finished entity", entity_key, entities)

            },
            // called while loading is progressing
            function ( xhr ) {

                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {

                console.log( 'An error happened', error );

            }
        );
    }else if (entities[entity_key] == "loading"){
        console.log("loading")
        return
    }else{
        // console.log("entity moving", entity_data)
        const gltf = entities[entity_key]['gltf']

        gltf.scene.position.x = x
        gltf.scene.position.y = y - 1.1
        gltf.scene.position.z = z

        const gltfEuler = new THREE.Euler(0, 0, 0, "YXZ")

        gltf.scene.rotation.x = rx
        gltf.scene.rotation.y = ry;
        gltf.scene.rotation.z = rz

        // flip around
        gltfEuler.setFromQuaternion(gltf.scene.quaternion)
        gltfEuler.x = 0;
        gltfEuler.y += Math.PI;
        gltfEuler.z = 0;
        gltf.scene.quaternion.setFromEuler(gltfEuler)
        // gltf.scene.rotation.x = 0
        // gltf.scene.rotation.z = 0

        const plane = entities[entity_key]['plane']

        plane.position.x = x
        plane.position.y = y+1.2
        plane.position.z = z

        plane.lookAt(window.camera.position)
        // plane.rotation.x = 0
        // plane.rotation.y += Math.PI;
        // plane.rotation.z = 0

        // flip around
        gltfEuler.setFromQuaternion(plane.quaternion)
        gltfEuler.x = 0;
        // gltfEuler.y += Math.PI;
        gltfEuler.z = 0;
        plane.quaternion.setFromEuler(gltfEuler)

        const cssObject = entities[entity_key]['cssObject']

        cssObject.position.x = x
        cssObject.position.y = y+1.2
        cssObject.position.z = z

        cssObject.rotation.x = plane.rotation.x
        cssObject.rotation.y = plane.rotation.y
        cssObject.rotation.z = plane.rotation.z

        // plane.translateZ(-50)
        // plane.translateY(325)

        // cssobject.translateZ(-50)
        // cssobject.translateY(325)

        // entities[entity_key]['animation'] = animation
    }
}

function remove_entity(entity_data){
    let entity_key = entity_data['uid']
    console.log("removing:", entity_key, entities[entity_key])
    if (entities[entity_key] && !(entities[entity_key] == "loading")){
        gltf = entities[entity_key]['gltf']
        scene.remove( gltf.scene );
        plane = entities[entity_key]['plane']
        window.scene.remove(plane);
        cssObject = entities[entity_key]['cssObject']
        window.cssScene.remove(cssObject);

        // When changing names we need to give some time tolerance before readding the same player.
        entities[entity_key] = "loading"
        setTimeout(function(){
            // Delete the player to allow them to rejoin.
            delete entities[entity_key]
        }, 1000)
    }
}

function animateEntities(){
    for (entity_key in entities){
        let animation = entities[entity_key]['animation']
        if (animation != undefined){
            let mixer = entities[entity_key]['mixer']
            let clip = gltf.animations[animation]
            action = mixer.clipAction( clip );
            action.play();
            if (mixer){
                mixer.update( 2 * clock.getDelta() );
            }
        }
    }
}
