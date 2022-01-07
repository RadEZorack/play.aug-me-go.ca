function getWeightForObject(gameObject){
  // console.log("gameObject", window.playerXZHigh, gameObjectXZHigh, window.playerY, gameObject.altitude)
    // Find the euclidian distance.
    const gameObjectXZHigh = [gameObject.x, gameObject.z]//GEOPOS.projectionHigh(gameObject.lnglat);
    const distanceDropOff = function(){

      const distanceFromCenter = Math.sqrt(
        (window.playerXZHigh[0] - gameObjectXZHigh[0]) ** 2 +
        (window.playerY - gameObject.altitude)**2 +
        (window.playerXZHigh[1] - gameObjectXZHigh[1]) ** 2
      );
      return 1.0/distanceFromCenter
    }
    const heightDropOff = function(){
      const distanceFromCenter = Math.abs(window.playerY - gameObject.altitude)
      return 1.0/distanceFromCenter
    }
    // Find the angle of projection from the normal of the triangle > the direction of camera.
    // Ie. triangles that are backwards should have no chance of rendering, sideways less chance, straight facing, more chance
    // const orientation =
    // Find the angle of projection from the angle created by center of the triangle > the center of the camera > the direction of the camera.
    // Ie. things in front of the camera are given higher chances
    const fieldOfViewDropOff = function(){
      const fovVector = new THREE.Vector3(gameObjectXZHigh[0], gameObject.altitude, gameObjectXZHigh[1])
      let camVector = new THREE.Vector3( 0, 0, - 1 );
      camVector.applyQuaternion( window.camera.quaternion );
      // camVector.y = 0.0;
      let fovAngle = fovVector.angleTo(camVector);

      // fovAngle = Math.abs(1 - (fovAngle/Math.PI));
      // console.log(fovAngle)
      // if (fovAngle < 0){
      //   alert(fovAngle)
      // }
      return 1.0/fovAngle;
      // const justRight = 7/8;
      // const tooFar = 1/4;
      // if(fovAngle <= tooFar){
      //   // too far
      //   return 0.0;
      // }else{
      //   // greater than the "just right" zone
      //   return fovAngle ** 2;
      // }
    }

    // Size based on area of triangle
    // const sizeDropOff = function(){
    // }
    // console.log(distanceFromCenter)
    // Number of pixels before we drop since its so small. This triangle and try to render things infornt

    return distanceDropOff() ** 2 * fieldOfViewDropOff() ** 3// * heightDropOff();
}

////////////////////
function getNewSortedBlocks(){
  const length = Math.min(window.gameObjects.length, sortInstance);
  for (let i = 0, il = window.gameObjects.length; i < il; i += window.gameObjects.length/length) {
    let j = Math.floor(i);
    // if (i == 0){
    //   alert("hit")
    // }
    // if (i < length/ 4){
    //   // sample the beginnning
    //   j = i;
    // }else if(i > 3 * length/ 4){
    //   // sample the end... so we can eject and fetch new from the db
    //   j = window.gameObjects.length - length + i;
    // }else{
    //   // sample the middle with an even distribution
    //   // remember j = m * (i - x[0]) + y[0]
      // j = Math.floor( window.gameObjects.length - length/2)/(length/2) * (i - length) + length);
    // }
    // console.log(i,j)

    const gameObject = window.gameObjects[j];
    // if (gameObject == undefined){
    //   console.log(i,j,length,window.gameObjects.length)
    // }

    const timeDropOff = function(){
      return 1/performance.now();
    }

    const colorDropOff = function(){
      // let colorCount = 0;
      // if (gameObject.colorPicker in colorSet){
      //   colorCount = colorFrequency[gameObject.colorPicker];
      // }

      // trim off low color counts
      // if (colorCount >= 10){ //(window.innerWidth * window.innerHeight)/instances){

      if (colorSet.has(gameObject.colorPicker)){
        return 1.0;
      }else{
        return 0.9 + 0.0000001 * Math.random();
      }
    }





    const weightChance = colorDropOff()*getWeightForObject(gameObject);
    window.gameObjects[j].weightChance = weightChance;
  }

  window.gameObjects.sort(function(a, b) {
    return b["weightChance"] - a["weightChance"];
  });
  // console.log(window.gameObjects)
}
