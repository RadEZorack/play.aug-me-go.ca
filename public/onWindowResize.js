function onWindowResize(event) {
  window.camera.aspect = window.innerWidth / window.innerHeight;
  window.camera.updateProjectionMatrix();

  cssRenderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);
  rendererBackground.setSize(window.innerWidth, window.innerHeight);

  controlsOnWindowResize();
}
