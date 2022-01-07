

window.camera = undefined;
window.scene = undefined;
window.cssScene = undefined;
window.blockMeshInstanceIDKeys = {};
window.gameObjects = [];
window.lastTransformHigh = undefined;
window.svgHigh = undefined;
window.zoomHigh = undefined;
window.playerXZHigh = [0.0, 0.0];
window.playerLonLat = [-79.387054, 43.642567];
window.playerY = 1.1;
window.triangleMeshInstanceIDKeys = {};

const loader = new THREE.TextureLoader();
// if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
// console.log("Jimp", new Jimp.default())
let container, stats;
const options = { frequency: 60, referenceFrame: 'device' };
// try{
//   // const sensor = new AbsoluteOrientationSensor(options);
// }catch(e){

// }
const mat4 = new Float32Array(16);

let renderer;
let rendererBackground;
let rendererColor;
let cssRenderer;

// let mouse = new THREE.Vector2();
// let pickingData = [], pickingTexture, pickingScene;
// let offsetAttribute, orientationAttribute;
let blockMesh = undefined;
let boxMaterial = undefined;
let triangleMeshs = {};

let rendererCanvas = undefined;
let rendererGL = undefined;

// const outCanvas = document.createElement("canvas");
// const outContext = outCanvas.getContext("2d");
// let outImageData;
// outCanvas.width = window.innerWidth;
// outCanvas.height = window.innerHeight;
// outImageData = outContext.getImageData(0, 0, outCanvas.width, outCanvas.height);
const pixelBuffer = new Uint8ClampedArray(
  window.innerWidth * window.innerHeight * 4
);
const finalBuffer = new Uint8ClampedArray(
  window.innerWidth * window.innerHeight * 4
);

// let clock = new THREE.Clock();

// let gltf_loader = new THREE.GLTFLoader();
// // Optional: Provide a DRACOLoader instance to decode compressed mesh data
// let dracoLoader = new THREE.DRACOLoader();
// dracoLoader.setDecoderPath( "{% static 'chat/js/threejs/examples/js/libs/draco/' %}" );
// gltf_loader.setDRACOLoader( dracoLoader );

// let cesiumManArray = []
const cssObjectsArray = [];

// let colorSet = new Set([])
let colorFrequency = {};
let colorSet = new Set([]);

let lastTime = 0;
const now = new Date();

const moveQ = new THREE.Quaternion(0.5, 0.5, 0.5, 0.0).normalize();
const tmpQ = new THREE.Quaternion();
const currentQ = new THREE.Quaternion();
// let tempV = new THREE.Vector3();
// let tempV2 = new THREE.Vector3();
// let currentV = new THREE.Vector3();

// let planetRadius = 6378137; // Radius of planet. ie "sea level"
// let planetCircumference = 2*pi*planetRadius;

// window.playerXZHigh = [0.0, 0.0];
// window.playerLonLat = [-79.387054, 43.642567];
// window.playerY = 1.1;
let playerK = 1 << 19;


// let ground_map = undefined;

const euler = new THREE.Euler(0, 0, 0, "YXZ");
const PI_2 = Math.PI / 2;

const drawInstances = 256 * 256 * 16; //
const sortInstance = 256 * 128 //
const maxInstances = 256 * 256 * 256 - 1; //
let colorPicker = [];

let lastBlockX = 0;
let lastBlockY = 0;
let lastBlockZ = 0;

let triangleOffsets = [];
let triangleUvs = [];
let triangleRgbas = [];
const triangleVertices = new Float32Array( [
  0, 0.0,  0,
  0, 0.0,  1,
  1, 0.0,  0
] );

const triangleNormals = new Float32Array( [
  0, 1.0,  0,
  0, 1.0,  0,
  0, 1.0,  0
] );

const triangleUVs = new Float32Array([0.0, 0.0, 0.0, 1.0, 1.0, 0.0])
const triangleColorPickers = new Float32Array( [
  0.0,
  0.0,
  0.0
] );

function initObjectsForTesting(){
    // This function needs to be defined in the "initObjectsForTesting.html" file
    return;
}
