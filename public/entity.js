var my_position = undefined
// Instantiate a loader
var gltf_loader = new THREE.GLTFLoader();

// // Optional: Provide a DRACOLoader instance to decode compressed mesh data
var dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath( "{% static 'chat/js/threejs/examples/js/libs/draco/' %}" );
gltf_loader.setDRACOLoader( dracoLoader );
function update_entity(entity_data){
    let entity_key = entity_data['uid']
    let r = entity_data['r']
    let g = entity_data['g']
    let b = entity_data['b']
    let x = entity_data['x']
    let y = entity_data['y']
    let z = entity_data['z']
    let rx = entity_data['rx']
    let ry = entity_data['ry']
    let rz = entity_data['rz']
    let px = entity_data['px']
    let py = entity_data['py']
    let pz = entity_data['pz']
    let prx = entity_data['prx']
    let pry = entity_data['pry']
    let prz = entity_data['prz']
    let animation = entity_data['animation']

    // if (entity_key == myUid){
    //     // if (my_position == undefined || Math.sqrt((my_position.x - x)**2 + (my_position.y - y)**2 + (my_position.z - z)**2) >= 0.9){
    //     //     // Player has either started or cheated or moved up a block
    //     // }
    //     if (my_position == undefined){
    //         // Player has started
    //         my_position = new THREE.Vector3(x, y, z)
    //         // camera.position.set( x, y, z );
    //     }
    //     // console.log(rx, ry, rz )
    //     // camera.rotation.set( rx, ry - Math.PI, rz );

    // }

    if (!(entity_key in entities)){
        entities[entity_key] = "loading"
        console.log("new entity", entity_key, entities)

        const geometry = new THREE.ConeGeometry( 0.25, 0.5, 4 );
        const material = new THREE.MeshBasicMaterial( {color: new THREE.Color( r, g ,b )} );
        const cone1 = new THREE.Mesh( geometry, material );
        scene.add( cone1 );

        if(entity_key != myUid){
            const cone2 = new THREE.Mesh( geometry, material );
            scene.add( cone2 );

            const page = create3dPage(
                // 1m wide
            200, 200,
            0.005,
            new THREE.Vector3(x, y, z),
            new THREE.Vector3(0, ry, 0),
            "",
            `<div class="video-container" style="width: 200px; height: 200px; background-color: black;">
                <div style="position: absolute; top: 5px; left: 50%; transform: translate(-50%, 0);">Temporary</div>
                <video autoplay class="remote-video" id="remote-video-${entity_key}" style="max-width: 100%; max-height: 100%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></video>
            </div>`
            );
            console.log('page', page);
        
            // remoteStream = new MediaStream();
            // document.querySelector(`#remote-video-${entity_key}`).srcObject = remoteStream;
            
            entities[entity_key] = {
                'plane': page.plane,
                'cssObject': page.cssObject,
                'cone2': cone2,
            }
            connectWebRTC(entity_key);
        }else{
            entities[entity_key] = {
                'plane': null,
                'cssObject': null,
                'cone2': null,
            }
        }

        gltf_loader.load(
            // resource URL
            cesiumManUrl,
            // called when the resource is loaded
            function ( gltf ) {
                console.log('gltf', gltf)
                window.scene.add( gltf.scene );


                entities[entity_key] = {
                    'gltf': gltf,
                    'plane': entities[entity_key]['plane'],
                    'cssObject': entities[entity_key]['cssObject'],
                    'mixer': new THREE.AnimationMixer(gltf.scene),
                    'cone1': cone1,
                    'cone2': entities[entity_key]['cone2'],
                    'animation': 0,
                }
                console.log("passed")

                gltf.scene.position.x = px
                gltf.scene.position.y = py
                gltf.scene.position.z = pz

                // gltf.scene.rotation.x = rx
                gltf.scene.rotation.y = pry
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
        // console.log("entity moving", entity_data, entities)
        if (entity_key != myUid){
            const gltf = entities[entity_key]['gltf']

            gltf.scene.position.x = px
            gltf.scene.position.y = py
            gltf.scene.position.z = pz

            // const gltfEuler = new THREE.Euler(0, 0, 0, "YXZ")

            gltf.scene.rotation.x = prx
            gltf.scene.rotation.y = pry;
            gltf.scene.rotation.z = prz

            const cone1 = entities[entity_key]['cone1']

            cone1.position.x = px
            cone1.position.y = py + 2;
            cone1.position.z = pz

            // cone1.rotation.x = prx
            // cone1.rotation.y = pry;
            // cone1.rotation.z = prz
            cone1.rotation.z = Math.PI;
        }

        // flip around
        // gltfEuler.setFromQuaternion(gltf.scene.quaternion)
        // gltfEuler.x = 0;
        // gltfEuler.y += Math.PI;
        // gltfEuler.z = 0;
        // gltf.scene.quaternion.setFromEuler(gltfEuler)
        // gltf.scene.rotation.x = 0
        // gltf.scene.rotation.z = 0

        const plane = entities[entity_key]['plane']
        const cssObject = entities[entity_key]['cssObject']
        const cone2 = entities[entity_key]['cone2']

        if (plane != undefined && cssObject != undefined && cone2 != undefined){
            plane.position.x = x
            plane.position.y = y
            plane.position.z = z

            plane.lookAt(window.camera.position)
            // plane.rotation.x = 0
            // plane.rotation.y = ry;
            // plane.rotation.y += Math.PI;
            // plane.rotation.z = 0

            cone2.position.x = x
            cone2.position.y = y + 1;
            cone2.position.z = z

            // cone2.rotation.x = rx
            // cone2.rotation.y = ry;
            // cone2.rotation.z = rz
            cone2.rotation.z = Math.PI;
        

            // flip around
            // gltfEuler.setFromQuaternion(plane.quaternion)
            // gltfEuler.x = 0;
            // // gltfEuler.y += Math.PI;
            // gltfEuler.z = 0;
            // plane.quaternion.setFromEuler(gltfEuler)

            cssObject.position.x = x
            cssObject.position.y = y
            cssObject.position.z = z

            cssObject.rotation.x = plane.rotation.x
            cssObject.rotation.y = plane.rotation.y
            cssObject.rotation.z = plane.rotation.z
        }

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
    if (entities[entity_key]){
        gltf = entities[entity_key]['gltf']
        scene.remove( gltf.scene );

        const remoteVideo = document.getElementById(`remote-video-${entity_key}`);
        try{
            remoteVideo.srcObject.getTracks().forEach(track => track.stop());
        }catch (e){
            console.log(e);
        }
        

        plane = entities[entity_key]['plane']
        window.scene.remove(plane);
        cssObject = entities[entity_key]['cssObject']
        window.cssScene.remove(cssObject);
        cone1 = entities[entity_key]['cone1']
        window.scene.remove(cone1);
        cone2 = entities[entity_key]['cone2']
        window.scene.remove(cone2);

        if (entities[entity_key]['peerConnection']) {
            entities[entity_key]['peerConnection'].close();
        }
    
        // if (peerConnection) {
        //     peerConnection.close();
        // }

        // delete entities[entity_key]["peerConnectionSend"]
        // delete entities[entity_key]["peerConnectionReceive"]

        delete entities[entity_key]
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
