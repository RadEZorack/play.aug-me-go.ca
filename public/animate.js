let frameCount = 0;
const clock = new THREE.Clock()
function animate() {
  // console.log("animating")
  requestAnimationFrame(animate);

  // try {
  //   // sensor.populateMatrix(mat4);
  //   camera.quaternion.fromArray(sensor.quaternion);
  //   camera.rotation.x -= PI_2;
  //   // camera.rotation.y += PI_2;
  //   // console.log(mat4)
  // } catch(e) {
  //   // mat4 has not been updated.
  //   // console.log(e)
  // }

  render();
  stats.update();

  for (entity_key in entities){
      let animation = entities[entity_key]['animation']
      if (animation != undefined){
        const gltf = entities[entity_key]['gltf']
          let mixer = entities[entity_key]['mixer']
          let clip = gltf.animations[animation]
          action = mixer.clipAction( clip );
          action.play();
          if (mixer){
              mixer.update( 2 * clock.getDelta() );
          }
      }
  }

  // frameCount += 1;
  // if (frameCount == 1){
  //   getNewPixelBuffer();
  // }else if (frameCount == 2){
  //   getNewColorSet();
  // }else if (frameCount == 3){
  //   // getNewSortedBlocks();
  // }else if (frameCount == 4){
  //   fetchAndDeleteObjects();
  //   frameCount = 0;
  // }

}
