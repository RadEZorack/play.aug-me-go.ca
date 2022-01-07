function myInit() {
  console.log("Starting game!");

  for (let i = 0; i < drawInstances; i++) {
    triangleOffsets.push(
      0.0, 0.0,  0.0,
      1.0, 0.0,  0.0,
      0.0, 1.0,  0.0
    );

    triangleUvs.push(
      0.0, 0.0,
      0.0, 1.0,
      1.0, 0.0,
    );

    triangleRgbas.push(
      // 0.0, 0.0, 0.0, 0.0,
      // 0.0, 0.0, 0.0, 0.0,
      0.0, 0.0, 0.0, 0.0
    );
  }

  // We avoid starting at 0;
  for (let i = 0; i < maxInstances; i++){
    colorPicker.push(i)
  }

  initControls();

  ////////////////////////////////////

  window.camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.01,
    10000
  );


  window.scene = new THREE.Scene();
  window.objectScene = new THREE.Scene();
  window.objectScene.background = new THREE.Color(0xB1E1FF);
  window.scene.add(window.objectScene)
  window.cssScene = new THREE.Scene();

  // const skyColor = 0xB1E1FF;  // light blue
  // const groundColor = 0xB97A20;  // brownish orange
  // const intensity = 1;
  // const skyLight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  // window.objectScene.add(skyLight);

  // const sphereRadius = 3;
  // const sphereWidthDivisions = 32;
  // const sphereHeightDivisions = 16;
  // const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
  // const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
  // const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  // mesh.castShadow = true;
  // mesh.receiveShadow = true;
  // mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
  // window.objectScene.add(mesh);

  window.sun = new THREE.SpotLight()
  window.sun.castShadow = true;
  window.sun.position.set(40, 40, 40);
  window.sun.target.position.set(-4, -4, -4);
  // window.sun.shadowCameraVisible = true;
  window.objectScene.add(window.sun)
  ///////////////////////////////////////////////

  console.log("Creating renderer");

  rendererBackground = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  rendererBackground.shadowMap.enabled = true;
  rendererBackground.setPixelRatio(window.devicePixelRatio);
  rendererBackground.setSize(window.innerWidth, window.innerHeight);
  rendererBackground.domElement.style.position = 'absolute';
  rendererBackground.domElement.style.top = 0;
  rendererBackground.domElement.style.left = 0;
  rendererBackground.domElement.style.zIndex = -1;
  rendererBackground.domElement.style.pointerEvents = 'none';

  renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = 0;
  renderer.domElement.style.left = 0;
  renderer.domElement.style.zIndex = 2;
  renderer.domElement.style.pointerEvents = 'none';

  rendererColor = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  rendererColor.setPixelRatio(window.devicePixelRatio);
  rendererColor.setSize(window.innerWidth, window.innerHeight);
  rendererColor.domElement.style.position = 'absolute';
  rendererColor.domElement.style.top = 0;
  rendererColor.domElement.style.left = 0;
  rendererColor.domElement.style.zIndex = 3;
  rendererColor.domElement.style.pointerEvents = 'none';

  cssRenderer = createCssRenderer();
  cssRenderer.domElement.appendChild(rendererColor.domElement);
  cssRenderer.domElement.appendChild(renderer.domElement);
  cssRenderer.domElement.appendChild(rendererBackground.domElement);

  threeJSContainer = document.getElementById("threeJSContainer");
  threeJSContainer.appendChild(cssRenderer.domElement);

  rendererCanvas = threeJSContainer.getElementsByTagName("canvas")[0]; //rendererColor
  rendererGL = rendererCanvas.getContext("webgl");

  if (renderer.extensions.get("ANGLE_instanced_arrays") === null) {
    document.getElementById("notSupported").style.display = "";
    console.log("Failed ANGLE_instanced_arrays")
  }

  stats = new Stats();
  threeJSContainer.appendChild(stats.dom);

  window.addEventListener("resize", onWindowResize, false);

  // cssObjectsArray.push(
  //   create3dPage(
  //     400,
  //     100 + 400,
  //     0.01,
  //     new THREE.Vector3(0, 0, -10),
  //     new THREE.Vector3(0, 0, 0),
  //     "https://www.youtube.com/embed/ffLLmV4mZwU",
  //     ""
  //   )
  // );

  // cssObjectsArray.push(
  //   WEBPAGE3D.create3dPage(
  //     600,
  //     100 + 400,
  //     0.01,
  //     new THREE.Vector3(0, 0, -9),
  //     new THREE.Vector3(0, 0, 0),
  //     "",
  //     "<button>A very long button .....................</button>"
  //   )
  // );

  console.log("finish init");

  // sensor.start();


  // if (navigator.geolocation) {
  //   navigator.geolocation.getCurrentPosition(
  //     function(position){
  //       console.log(
  //         "Latitude: " + position.coords.latitude +
  //         "Longitude: " + position.coords.longitude +
  //         "Altitude: " + position.coords.altitude)
  //       window.playerLonLat = [position.coords.longitude, position.coords.latitude]
  //       window.playerXZHigh = [0.0, 0.0]

  //     });

  // }
  // GEOPOS.initTiles();
  render();
  initObjectsForTesting();

  // for (let i = 0, il = window.gameObjects.length; i < il; i++) {
  //   const gameObject = window.gameObjects[i];
  //   const weightChance = getWeightForObject(gameObject);
  //   // console.log(weightChance)
  //   window.gameObjects[i].weightChance = weightChance;
  // }

  // window.gameObjects.sort(function(a, b) {
  //   return b["weightChance"] - a["weightChance"];
  // });

  redrawObjects();

  sendPlayerData()

  animate();

  console.log(window.gameObjects)

}
