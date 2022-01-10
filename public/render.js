function render() {
  const time = performance.now();

  const delta = time - lastTime;

  // window.sun.position.y -= 0.001*delta;

  lastTime =  time;

  /////////////////
  // if (
  //   !(
  //     window.lastTransformHigh.x ==
  //     ((window.lastTransformHigh.x - window.playerXZHigh[0]) * playerK) /
  //       window.lastTransformHigh.k
  //   ) ||
  //   !(
  //     window.lastTransformHigh.y ==
  //     ((window.lastTransformHigh.y - window.playerXZHigh[1]) * playerK) /
  //       window.lastTransformHigh.k
  //   )
  // ) {

  //   window.svgHigh
  //     .call(window.zoomHigh)
  //     .call(
  //       window.zoomHigh.transform,
  //       d3.zoomIdentity
  //         .translate(
  //           ((window.lastTransformHigh.x - window.playerXZHigh[0]) * playerK) /
  //             window.lastTransformHigh.k,
  //           ((window.lastTransformHigh.y - window.playerXZHigh[1]) * playerK) /
  //             window.lastTransformHigh.k
  //         )
  //         .scale(playerK)
  //     );

  //   window.playerXZHigh = [0, 0];
  // }

  ///////////////

  let deltaZ = 0;
  let deltaX = 0;
  let deltaY = 0;
  let deltaK = 0;

  euler.setFromQuaternion(window.camera.quaternion);

  euler.y -= 0.0002 * delta * (Math.round(2*window.rightJoystickXPercent) * PI_2);
  euler.x += 0.0002 * delta * (Math.round(2*window.rightJoystickYPercent) * PI_2);

  euler.x = Math.max(-PI_2, Math.min(PI_2, euler.x));

  window.camera.quaternion.setFromEuler(euler);

  // Forward and backward
  deltaZ =
    0.001 *
    delta *
    (Math.cos(euler.y) * Math.round(2*window.leftJoystickYPercent) +
      Math.sin(euler.y) * Math.round(2*window.leftJoystickXPercent));
  // // Left and Right
  deltaX =
    0.001 *
    delta *
    (Math.sin(euler.y) * Math.round(2*window.leftJoystickYPercent) -
      Math.cos(euler.y) * Math.round(2*window.leftJoystickXPercent));
  // Player Up and Down
  deltaY = -0.001 * delta * Math.round(2*window.middleJoystickYPercent);
  // Player map zoom
  deltaK = -0.0005 * delta * Math.round(2*window.middle2JoystickXPercent);

  // boxMesh.position.x += deltaX

  // X Pixel
  // window.playerXZHigh[0] -= deltaX; // / size_of_pixel
  window.camera.position.x -= deltaX;
  // Y Pixel
  // window.playerXZHigh[1] -= deltaZ; // / size_of_pixel
  window.camera.position.z -= deltaZ;
  // Height
  // if (window.playerY - deltaY <= -10) {
  //   deltaY = 0;
  // }
  // window.playerY -= deltaY * 256;
  window.camera.position.y -= deltaY;

  if(entities[myUid] != undefined && entities[myUid]['gltf'] != undefined){
    let my_player = entities[myUid]['gltf'].scene;
    magnitude = Math.sqrt(Math.pow(my_player.position.x - window.camera.position.x, 2) + Math.pow(my_player.position.z - window.camera.position.z, 2))
    
    if(magnitude >= 5){
      my_player.position.x += 0.0009 * delta * (window.camera.position.x - my_player.position.x) / magnitude;
      my_player.position.z += 0.0009 * delta * (window.camera.position.z - my_player.position.z) / magnitude;
    }

    const raycaster = new THREE.Raycaster(
                        new THREE.Vector3(my_player.position.x, my_player.position.y + 2, my_player.position.z),
                        new THREE.Vector3(0, -1, 0),
                        0,
                        2
                      );
    
    const intersects = raycaster.intersectObjects( Array.from(window.scene.children), true );

    let shouldFall = true;
    for(let i = 0; i < intersects.length; i++) {
      if (intersects[ i ].object.name != "Cesium_Man"){
        my_player.position.y += 2 - intersects[ i ].distance;
        shouldFall = false;
        break;
      }
    }
    if(shouldFall == true){
      my_player.position.y -= 0.0009 * delta;
    }
    // console.log(my_player.position.y);

    

    my_player.lookAt(window.camera.position);
    // my_player.rotation.x = 0
    // plane.rotation.y = ry;
    // plane.rotation.y += Math.PI;
    // my_player.rotation.z = 0

    const gltfEuler = new THREE.Euler(0, 0, 0, "YXZ")
    gltfEuler.setFromQuaternion(my_player.quaternion)
    gltfEuler.x = 0;
    // gltfEuler.y += Math.PI;
    gltfEuler.z = 0;
    my_player.quaternion.setFromEuler(gltfEuler)

    entities[myUid]['cone1'].position.x = my_player.position.x;
    entities[myUid]['cone1'].position.y = my_player.position.y + 2;
    entities[myUid]['cone1'].position.z = my_player.position.z;

    entities[myUid]['cone1'].rotation.z = Math.PI;
    
  }

  // Zoom
  if (playerK - playerK * deltaK > 2 ** 20) {
    deltaK = 0;
  }
  playerK -= playerK * deltaK;

  // for (const key in triangleMeshs){
  //     const triangleMesh = triangleMeshs[key].mesh
  //   triangleMesh.position.y += deltaY * 256;

  //   let j = 0;
  //   let k = 0;
  //   const transformObject = new THREE.Object3D();
  //   for (let i = 0, il = triangleMesh.count; i < il; i++) {
  //     const instanceMatrix = new THREE.Matrix4();
  //     triangleMesh.getMatrixAt(j++, instanceMatrix);

  //     transformObject.position.set(
  //       (instanceMatrix.elements[12] + deltaX * 256) * (1 - deltaK),
  //       instanceMatrix.elements[13] * (1 - deltaK),
  //       (instanceMatrix.elements[14] + deltaZ * 256) * (1 - deltaK)
  //     );
  //     transformObject.scale.set(
  //       playerK / 2 ** 19,
  //       playerK / 2 ** 19,
  //       playerK / 2 ** 19
  //     );
  //     transformObject.setRotationFromMatrix(instanceMatrix)
  //     transformObject.updateMatrix();

  //     triangleMesh.setMatrixAt(k++, transformObject.matrix);
  //   }
  //   triangleMesh.instanceMatrix.needsUpdate = true;
  // }

  // const planeEuler = new THREE.Euler(0, 0, 0, "YXZ")
  // for (let i = 0, il = cssObjectsArray.length; i < il; i++) {
  //   const plane = cssObjectsArray[i].plane

  //   plane.lookAt(window.camera.position)

  //   // flip around
  //   planeEuler.setFromQuaternion(plane.quaternion)
  //   planeEuler.x = 0;
  //   planeEuler.z = 0;
  //   plane.quaternion.setFromEuler(planeEuler)

  //   const cssObject = cssObjectsArray[i].cssObject

  //   cssObject.rotation.x = plane.rotation.x
  //   cssObject.rotation.y = plane.rotation.y
  //   cssObject.rotation.z = plane.rotation.z
  // }

  // for (const url in window.planeUrls) {
  //   window.planeUrls[url].plane.position.y += deltaY * 256;
  //   // window.planeUrls[url].plane.scale.x -= window.planeUrls[url].plane.scale.x * deltaK;
  //   // window.planeUrls[url].plane.scale.y *= (1 - deltaK)
  //   // window.planeUrls[url].plane.scale.z -= window.planeUrls[url].plane.scale.z * deltaK;
  // }

  lastBlockX -= deltaX;
  lastBlockY -= deltaY;
  lastBlockZ -= deltaZ;

  // if (Math.sqrt(lastBlockX ** 2 + lastBlockZ ** 2) >= 256 / 8) {
  //   console.log("distance reached");
  //   fetchAndDeleteObjects();
  // }

  cssRenderer.render(window.cssScene, window.camera);

  renderer.setRenderTarget(null);
  renderer.render(window.scene, window.camera);

  rendererBackground.setRenderTarget(null);
  rendererBackground.render(window.objectScene, window.camera);
}
