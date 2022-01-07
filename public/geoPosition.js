// import * as THREE from "three";
import { THREE } from "@/scripts/game/CSS3DRenderer";
import * as d3 from "d3";
import * as d3Geo from "d3-geo";
import * as d3Tile from "d3-tile";
import * as d3Zoom from "d3-zoom";

// let window.playerXZHigh = window.window.playerXZHigh;
// const window.playerLonLat = window.window.playerLonLat;
// const window.playerY = window.window.playerY;
// const window.scene = window.window.scene;
// let window.lastTransformHigh = window.window.lastTransformHigh;

const mapWidth = 4;
const mapHeight = 4;
// const mapWidthLow = 1;
// const mapHeightLow = 1;

const pi = Math.PI,
  tau = 2 * pi;
// const svg = undefined;
// let window.svgHigh = undefined;
// let svgLow = undefined;
const zoomHigh = undefined;
// const zoomLow = undefined;
let masterUrls = new Set();
let addUrls = new Set();
let removeUrls = new Set();

// url = (x, y, z) => {
// }
export function getUrlHigh(x, y, z) {
  // return `https://c.tile.openstreetmap.org/${z}/${x}/${y}.png`
  // return `https://api.mapbox.com/v4/mapbox.terrain-rgb/${z}/${x}/${y}.pngraw?access_token=pk.eyJ1IjoiYWFyb25tYWRlciIsImEiOiJjajBtb2h4bzcwMGk1MzJ0YzhjdGp1bDVqIn0.6LlTYKfQUQzRgfvtGDOa4A`
  // return `http://mt1.google.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}`
  // return `https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/${z}/${x}/${y}.mvt?access_token=pk.eyJ1IjoidHJhdmlzbWlsbGVyIiwiYSI6ImNrbG51MnhtejBtbjUyb2tkeDgwczcwYTEifQ.ePO1Yt_E0QnoJYatXm7Shw`
  return `https://api.mapbox.com/v4/mapbox.satellite/${z}/${x}/${y}.png?access_token=pk.eyJ1IjoidHJhdmlzbWlsbGVyIiwiYSI6ImNrbG51MnhtejBtbjUyb2tkeDgwczcwYTEifQ.ePO1Yt_E0QnoJYatXm7Shw`;
}
// function getUrlLow(x, y, z){
//   // return `https://c.tile.openstreetmap.org/${z}/${x}/${y}.png`
//   return `https://api.mapbox.com/v4/mapbox.terrain-rgb/${z}/${x}/${y}.pngraw?access_token=pk.eyJ1IjoiYWFyb25tYWRlciIsImEiOiJjajBtb2h4bzcwMGk1MzJ0YzhjdGp1bDVqIn0.6LlTYKfQUQzRgfvtGDOa4A`
// }

export const projectionHigh = d3Geo
  .geoMercator()
  .scale(1 / tau)
  .translate([0, 0]);

// var projectionLow = d3.geoMercator()
//     .scale(1 / tau)
//     .translate([0, 0]);

export function initTiles() {
  console.log("init tiles");
  window.planeUrls = {};

  window.lastTransformHigh = d3.zoomIdentity;

  console.log("init tiles 1.1");

  // Initialize the projection to fit the world in a 1x1 square centered at the origin.
  window.svgHigh = d3
    .select("#container")
    .append("svg")
    .attr("viewBox", [0, 0, mapWidth, mapHeight]);
  // svgLow = d3
  //   .select("#container")
  //   .append("svg")
  //   .attr("viewBox", [0, 0, mapWidthLow, mapHeightLow]);

  console.log("init tiles 1.2");

  const tileHigh = d3Tile
    .tile()
    .extent([
      [0, 0],
      [mapWidth, mapHeight]
    ])
    .tileSize(1)
    .clampX(false);

  console.log("init tiles 2");

  // const tileLow = d3
  //   .tile()
  //   .extent([
  //     [0, 0],
  //     [mapWidthLow, mapHeightLow]
  //   ])
  //   .tileSize(1)
  //   .clampX(false);

  // zoomLow = d3.zoom()
  //     .scaleExtent([1 << 10, 1 << 19])
  //     .extent([[0, 0], [mapWidthLow, mapHeightLow]])
  //     .on("zoom", ({transform}) => zoomed(window.lastTransformHigh, transform));

  // let imageHigh = window.svgHigh.append("g")
  //     .attr("pointer-events", "none")
  //     .selectAll("image");

  // let imageLow = svgLow.append("g")
  //     .attr("pointer-events", "none")
  //     .selectAll("image");

  // window.svgHigh.call(zoomHigh)
  //     .call(zoomHigh.transform,
  //       d3.zoomIdentity
  //         .translate(mapWidth >> 1, mapHeight >> 1)
  //         .scale(playerK)
  // )
  // svgLow.call(zoomLow)
  //     .call(zoomLow.transform,
  //       d3.zoomIdentity
  //         .translate(mapWidthLow >> 1, mapHeightLow >> 1)
  //         .scale(playerK)
  //         );

  window.playerXZHigh = projectionHigh(window.playerLonLat);
  // window.playerXZHigh = [0,0]
  // console.log('window.playerXZHighinit', window.playerXZHigh)
  // playerXZLow = projectionLow(window.playerLonLat)
  // window.playerXZHighLast = window.playerXZHigh;

  // boxMesh.position.x = 0//-256/2
  // boxMesh.position.z = 0//-256/2
  // boxMesh2.position.x = 0//-256/2
  // boxMesh2.position.z = 0//-256/2

  /////

  console.log("init tiles 3");

  function zoomed(transformHigh) {
    // console.log('transformHigh', transformHigh)
    projectionHigh
      .scale((256 * transformHigh.k) / tau)
      .translate([256 * transformHigh.x, 256 * transformHigh.y]);

    // Top Left
    // lonLatProj = projectionHigh.invert([0,0])
    // // console.log(lonLatProj)
    // // Bottom left
    // lonLatProj = projectionHigh.invert([0,1])
    // // console.log(lonLatProj)
    // pixelWidthM = 110567 * (lonLatProj[1] - lonLatProj[0])
    //

    window.lastTransformHigh = transformHigh;
    // console.log(window.lastTransformHigh)

    const tilesHigh = tileHigh(transformHigh);
    // console.log(tilesHigh)

    // if (transformLow == undefined){
    //   transformLow = lastTransformLow
    // }
    // lastTransformLow = transformLow
    // console.log(lastTransformLow)

    // projectionLow
    //   .scale(transformLow.k / tau)
    //   .translate([transformLow.x, transformLow.y]);

    // const tilesLow = tileLow(transformHigh);
    // console.log(tilesLow[0])

    // imageHigh = imageHigh.data(tilesHigh, d => d).join("image")
    //     .attr("xlink:href", d => getUrl(...d3.tileWrap(d)))
    //     .attr("x", ([x]) => (x + tilesHigh.translate[0]) * tilesHigh.scale)
    //     .attr("y", ([, y]) => (y + tilesHigh.translate[1]) * tilesHigh.scale)
    //     .attr("width", tilesHigh.scale)
    //     .attr("height", tilesHigh.scale);

    addUrls = new Set();
    removeUrls = new Set();

    for (let i = 0; i < tilesHigh.length; i++) {
      // if (i == 1){
      //   continue
      // }
      // if( i == 0){

      // }
      // if ( i == 1 ){
      //   break;
      // }
      // for (let i = 0; i < 4; i++){
      const d = tilesHigh[i];
      d[0] -= 2;
      d[1] -= 2;
      const url = getUrlHigh(...d3Tile.tileWrap(d));
      // let dLow = tilesLow[i];
      addUrls.add(url);
      // if (dLow == undefined){
      //   continue;
      // }
      // let urlLow = getUrlLow(...d3.tileWrap(dLow));
      if (!(masterUrls.has(url))) {
        const texture = new THREE.TextureLoader().load(url);

        const geometry = new THREE.PlaneGeometry(256, 256, 4, 4);
        const material = new THREE.MeshBasicMaterial({
          // color: 0xffff00,
          map: texture,
          side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -pi / 2;

        // TODO: READD
        window.objectScene.add(plane);

        // plane.scale.x = tilesHigh.scale
        // plane.scale.y = tilesHigh.scale
        // plane.scale.z = tilesHigh.scale

        // console.log(d)
        // plane.position.x = (d[0] + tilesHigh.translate[0]) * tilesHigh.scale * 4;
        // plane.position.z = (d[1] + tilesHigh.translate[1]) * tilesHigh.scale * 4;
        window.planeUrls[url] = { plane: plane, blocks: {} };

        // let heightUrl = url
        // let myImg = new Image();
        // // console.log("pre load", url)
        // myImg.onload = function() {
        //   return
        //   let plane = window.planeUrls[url].plane
        //   if (plane == undefined){
        //     console.log("fail", url)
        //     // This was deleted by a render event
        //     return
        //   }
        //   //   // console.log("success", url, plane)

        //   // console.log(pixelWidthM)

        //   // let vertices = plane.geometry.vertices
        //   /////////
        //   let canvas = document.createElement("canvas")
        //   canvas.width = 256
        //   canvas.height = 256
        //   let context = canvas.getContext('2d');
        //   context.drawImage(myImg, 0, 0);
        //   for(let a = 0; a <= 255; a += 1){
        //     for(let b = 0; b <= 255; b += 1){
        //       let pixelX = Math.floor(a * 255 / 255)
        //       let pixelY = Math.floor(b * 255 / 255)
        //       let data = context.getImageData(pixelX, pixelY, 1, 1).data;

        //       // let pixelZ = 4 * (-10000 + ((data[k] * 256 * 256 + data[k+1] * 256 + data[k+2]) * 0.1)) / pixelWidthM

        //       let planeX = (d[0] + tilesHigh.translate[0]) * tilesHigh.scale * 256
        //       let planeY = (d[1] + tilesHigh.translate[1]) * tilesHigh.scale * 256
        //       // console.log(d[0], tilesHigh.translate[0])
        //       // console.log(d[1], tilesHigh.translate[1])
        //       // console.log(planeX, pixelX)
        //       // console.log(planeY, pixelY)
        //       // let j = a + b * 5;
        //       let date = new Date();
        //       let time = date.getTime();
        //       window.planeUrls[url].blocks[`${pixelX},${pixelY}`] ={
        //           "uuid": time,
        //           "position": new THREE.Vector3(a + planeX, -window.playerY, b + planeY),
        //           // "distance_from_center": distance_from_center,
        //           "rgba": new THREE.Vector4(data[0]/256, data[1]/256, data[2]/256, data[3]/256),
        //           "texture_id": 0
        //       }
        //       // console.log(a* tilesHigh.scale*8 + planeX, -window.playerY, b * tilesHigh.scale*8  + planeY)
        //     }
        //   }
        //   console.log("drawing new terrain")
        //   fetchAndDeleteObjects()

        //   ////////
        //   // let data = context.getImageData(0, 0, 256, 256).data;
        //   // for (let a = 0; a <= 257; a += 1){
        //   //   console.log(a, context.getImageData(a, a, 1, 1).data)
        //   // }

        //   // Top Left
        //   // lonLatProj = projectionHigh.invert([plane.position.x,plane.position.z])
        //   // console.log(lonLatProj)
        //   // Bottom left
        //   // lonLatProj = projectionHigh.invert([plane.position.x,plane.position.z+1])
        //   // console.log(lonLatProj)
        //   // pixelWidthM = 110567 * (lonLatProj[1] - lonLatProj[0])/ 2**d[2]
        //   // console.log(pixelWidthM)

        //   // for(let a = 0; a <= 4; a += 1){
        //   //   for(let b = 0; b <= 4; b += 1){
        //   //     let j = a + b * 5;
        //   //     // let k = 4*(Math.floor(b * 256 / 2) + 256 * Math.floor(a * 256 / 2))
        //   //     // console.log('j', vertices.length, j)
        //   //     // console.log(Math.floor(b * 255 / 4), Math.floor(a * 255 / 4))
        //   //     let data = context.getImageData(Math.floor(a * 255 / 4), Math.floor(b * 255 / 4), 1, 1).data;
        //   //     k = 0;
        //   //     // console.log('length', data)
        //   //     // console.log('k', data.length, k, data[k-1], data[k], data[k+1], data[k+2], data[k+3])
        //   //     // console.log(d)
        //   //     vertices[j].z = 4 * (-10000 + ((data[k] * 256 * 256 + data[k+1] * 256 + data[k+2]) * 0.1)) / pixelWidthM
        //   //     // plane.position.y = -window.playerY - 4 / pixelWidthM; // needs to the altitude
        //   //     // console.log(transformHigh.k, vertices[0].z, window.playerY, plane.position.y)
        //   //     // deltaY += vertices[0].z - window.playerY
        //   //     // window.playerY += deltaY

        //   //     // for ( let url in window.planeUrls) {
        //   //     //     // window.planeUrls[url].position.x += deltaX;
        //   //     //     window.planeUrls[url].position.y -= deltaY;
        //   //     //     // window.planeUrls[url].position.z += deltaZ;
        //   //     //   }
        //   //   }
        //   // }
        //   // console.log(window.planeUrls[url].geometry.vertices, plane.position)

        // }
        // myImg.crossOrigin = "Anonymous";
        // myImg.src = heightUrl;
      }
      const plane = window.planeUrls[url].plane;
      plane.scale.x = tilesHigh.scale;
      plane.scale.y = tilesHigh.scale;
      plane.scale.z = tilesHigh.scale;
      plane.position.x =
        (d[0] + tilesHigh.translate[0] + 1 / 2) * tilesHigh.scale * 256;
      plane.position.y = -window.playerY;
      plane.position.z =
        (d[1] + tilesHigh.translate[1] + 1 / 2) * tilesHigh.scale * 256;
      // if( i == 0){
      //   console.log(plane.position, d[0], tilesHigh.translate[0], tilesHigh.scale)
      //   break;
      // }
    }

    removeUrls = new Set([...masterUrls].filter(x => !addUrls.has(x)));
    // remove urls
    for (const url of removeUrls) {
      // console.log("delete", url)
      const plane = window.planeUrls[url].plane;
      window.scene.remove(plane);
      delete window.planeUrls[url];
    }

    masterUrls = addUrls;
    // data = {
    //   key: key,
    //   url : url,
    //   size: 256,
    //   d : d,
    //   translate : tilesHigh.translate,
    //   scale: tilesHigh.scale,
    // }
  }

  console.log("init tiles 4");

  window.zoomHigh = d3Zoom
    .zoom()
    .scaleExtent([1 << 10, 1 << 19])
    .extent([
      [0, 0],
      [mapWidth, mapHeight]
    ])
    .on("zoom", ({ transform }) => zoomed(transform));

  // console.log(window.zoomHigh);
  // function zoomedLow(transform) {
  //   lastTransformLow = transform
  //   console.log(lastTransformLow)

  //   projectionLow
  //     .scale(transform.k / tau)
  //     .translate([transform.x, transform.y]);

  //   const tilesLow = tileLow(transform);
  //   console.log(tilesLow[0])

  // //   imageLow = imageLow.data(tilesLow, d => d).join("image")
  // //       .attr("xlink:href", d => getUrl(...d3.tileWrap(d)))
  // //       .attr("x", ([x]) => (x + tilesLow.translate[0]) * tilesLow.scale)
  // //       .attr("y", ([, y]) => (y + tilesLow.translate[1]) * tilesLow.scale)
  // //       .attr("width", tilesLow.scale)
  // //       .attr("height", tilesLow.scale);
  // }
}
