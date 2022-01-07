const clickPosition = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
// const camera = window.camera;
// const scene = window.scene;

function selectedObject(e, preview = false) {
  // console.log(e)
  // let body_box = document.body.getBoundingClientRect();
  // console.log(body_box)
  // console.log(window.innerWidth, window.innerHeight)
  // Center around 0, with a range from -0.5 <> 0.5
  clickPosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  clickPosition.y = -(e.clientY / window.innerHeight) * 2 + 1;

  console.log(clickPosition);
  raycaster.setFromCamera(clickPosition, window.camera);
  console.log(Array.from(window.scene.children));
  console.log(raycaster);
  const intersects = raycaster.intersectObjects(
    Array.from(window.scene.children),
    true
  ); //array
  console.log("intersects", intersects);
  if (intersects.length > 0) {
    const selectedObject = intersects[0];
    console.log("selectedObject", selectedObject);
    // const position = selectedObject.point;
    return selectedObject;
  }
}
