var entities = {}
var my_position = undefined
// Instantiate a loader
var gltf_loader = new THREE.GLTFLoader();

// // Optional: Provide a DRACOLoader instance to decode compressed mesh data
var dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath( "{% static 'chat/js/threejs/examples/js/libs/draco/' %}" );
gltf_loader.setDRACOLoader( dracoLoader );
function update_entity(entity_data){
    let entity_key = entity_data['entity_key']
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
        name = entity_key.split(":")[1]
        const page = create3dPage(
            // 1.5m wide
          300, 300,
          0.005,
          new THREE.Vector3(x, y+1.2, z),
          new THREE.Vector3(0, ry, 0),
          webcamUrl+'?name='+name,
          "");
        // entities[entity_key] = {
        //             'plane': page.plane,
        //             'cssobject': page.cssObject
        // }

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
    let entity_key = entity_data['entity_key']
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
