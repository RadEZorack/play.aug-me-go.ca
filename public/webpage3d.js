// const window.scene = function(){ return window.window.scene};
// const window.cssScene = window.window.cssScene;

///////////////////////////////////////////////////////////////////
// Creates WebGL Renderer
//
///////////////////////////////////////////////////////////////////
function createGlRenderer() {
  const glRenderer = new THREE.WebGLRenderer({ alpha: true });

  glRenderer.setClearColor(0xecf8ff);
  glRenderer.setPixelRatio(window.devicePixelRatio);
  glRenderer.setSize(window.innerWidth, window.innerHeight);

  glRenderer.domElement.style.position = "absolute";
  glRenderer.domElement.style.zIndex = 1;
  glRenderer.domElement.style.top = 0;
  glRenderer.domElement.style.pointerEvents = "none";

  return glRenderer;
}

///////////////////////////////////////////////////////////////////
// Creates CSS Renderer
//
///////////////////////////////////////////////////////////////////
function createCssRenderer() {
  const cssRenderer = new THREE.CSS3DRenderer();

  cssRenderer.setSize(window.innerWidth, window.innerHeight);

  cssRenderer.domElement.style.position = "absolute";
  cssRenderer.domElement.style.zIndex = 1;
  cssRenderer.domElement.style.top = 0;

  return cssRenderer;
}

///////////////////////////////////////////////////////////////////
// Creates plane mesh
//
///////////////////////////////////////////////////////////////////
function createPlane(w, h, s, position, rotation) {
  const material = new THREE.MeshBasicMaterial({
    color: 0x010203,
    opacity: 0.0,
    side: THREE.DoubleSide
  });

  const geometry = new THREE.PlaneGeometry(w, h);

  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.x = position.x;
  mesh.position.y = position.y;
  mesh.position.z = position.z;

  mesh.rotation.x = rotation.x;
  mesh.rotation.y = rotation.y;
  mesh.rotation.z = rotation.z;

  mesh.scale.set(s, s, s);

  return mesh;
}

///////////////////////////////////////////////////////////////////
// Creates CSS object
//
///////////////////////////////////////////////////////////////////
function createCssObject(w, h, s, position, rotation, url, html) {
  // w *= 100
  // h *= 100
  if (url) {
    (html =
      '<iframe src="' +
      url +
      '" width="' +
      w +
      '" height="' +
      h +
      '" allow="autoplay">'),
      "</iframe>";
  }
  html = [
    '<div class="css3ddiv" style="width:' + w + "px; height:" + h + 'px;">',
    html,
    "</div>"
  ].join("\n");

  const div = document.createElement("div");

  $(div).append(html);

  const cssObject = new THREE.CSS3DObject(div);

  cssObject.position.x = position.x;
  cssObject.position.y = position.y;
  cssObject.position.z = position.z;

  cssObject.rotation.x = rotation.x;
  cssObject.rotation.y = rotation.y;
  cssObject.rotation.z = rotation.z;

  cssObject.scale.set(s, s, s);

  return cssObject;
}

///////////////////////////////////////////////////////////////////
// Creates 3d webpage object
//
///////////////////////////////////////////////////////////////////
function create3dPage(w, h, s, position, rotation, url, html) {
  // console.log(html)

  const plane = createPlane(w, h, s, position, rotation);

  // Manually call this when you want.
  window.scene.add(plane);

  const cssObject = createCssObject(w, h, s, position, rotation, url, html);

  window.cssScene.add(cssObject);

  return { plane: plane, cssObject: cssObject, scale: s };
}
