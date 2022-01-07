function getNewPixelBuffer() {
  // render()
  for (const key in triangleMeshs){
    const triangleMesh = triangleMeshs[key].mesh
    // triangleMesh.isColorPicker = 1.0;
    triangleMesh.geometry.attributes.isColorPicker.array = new Float32Array([1.0,1.0,1.0]);
    triangleMesh.geometry.attributes.isColorPicker.needsUpdate = true;
  }
  // renderer.clear();
  rendererColor.setRenderTarget(null);
  rendererColor.render(window.scene, window.camera);

  // TODO: https://stackoverflow.com/questions/25127751/opengl-read-pixels-faster-than-glreadpixels
  // colorFrequency = {}

  rendererGL.readPixels(
    0,
    0,
    window.innerWidth,
    window.innerHeight,
    rendererGL.RGBA,
    rendererGL.UNSIGNED_BYTE,
    pixelBuffer
  );

  // console.log(pixelBuffer)

  for (const key in triangleMeshs){
    const triangleMesh = triangleMeshs[key].mesh
    triangleMesh.geometry.attributes.isColorPicker.array = new Float32Array([0.0,0.0,0.0]);
    triangleMesh.geometry.attributes.isColorPicker.needsUpdate = true;
  }
  rendererColor.clear();

  // console.log('pixelBuffer', pixelBuffer)
}

function getNewColorSet(){
  colorSet = new Set([]);
  for (let i = 0; i < pixelBuffer.length; i += 4 * 4){
    // Sample every 4th pixels RGBA
    // This is actually a surprisingly expensive function... This seems to be a problem with going over a certain size?
    let id = ( pixelBuffer[ i ] << 16 ) | ( pixelBuffer[ i + 1 ] << 8 ) | ( pixelBuffer[ i + 2 ] );
    colorSet.add(id);
    // if (!(id in colorFrequency)){
    //   colorFrequency[id] = 1
    // }else{
    //   colorFrequency[id] += 1
    // }
  }
  // console.log(colorFrequency)
  // Create an array of color values
  // let colorArray = Object.keys(colorFrequency)
  // // console.log(colorArray)
  // // Sort according to the frequency
  // colorArray.sort(function(a, b) {
  //   return colorFrequency[b] - colorFrequency[a];
  // });
  // // Trim to the first N values
  // colorArray = colorArray.slice(0,instances)
  // colorSet = new Set(colorArray);
}
