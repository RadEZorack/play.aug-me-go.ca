function initObjectsForTesting() {
  // for (let i = 0; i < 256*16; i++){
  //   window.gameObjects.push({
  //     key: `initBlock:${i}`,
  //     lnglat: GEOPOS.projectionHigh.invert([(Math.random()-0.5)*256, (Math.random()-0.5)*256]),
  //     altitude: (Math.random()-0.5)*256,
  //     textureId: Math.floor(4 * Math.random()),
  //     colorPicker: colorPicker.pop(),
  //     rotationX: (Math.random()-0.5)*Math.PI,
  //     rotationY: (Math.random()-0.5)*Math.PI,
  //     rotationZ: (Math.random()-0.5)*Math.PI,
  //     weightChance: Math.random(),
  //   });
  // }
  let seed = 1;
  function random() {
      var x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
  }

  noise.seed(0)
  for (let x = -64; x < 64; x++) {
    for (let y = -1; y < 0; y++) {
      for (let z = -64; z < 64; z++) {
        // Grass or dirt
        id = Math.floor(12 * Math.random());
        let textureUrl = undefined
        if (noise.perlin2(x/5,z/5) >= 0){
          textureUrl = grass1Url
        }else{
          textureUrl = dirt1Url
        }

        window.gameObjects.push({
          key: `initBlock:${x},${y},${z}:0`,
          textureUrl: textureUrl,
          p1x: x,
          p1y: 3*noise.perlin2(x/10,z/10),
          p1z: z,

          p2x: x+1,
          p2y: 3*noise.perlin2((x+1)/10,z/10),
          p2z: z,

          p3x: x,
          p3y: 3*noise.perlin2(x/10,(z+1)/10),
          p3z: z+1,

          uv1x: 0.0,
          uv1y: 0.0,

          uv2x: 1.0,
          uv2y: 0.0,

          uv3x: 0.0,
          uv3y: 1.0,
          weightChance: Math.random(),
        });
        // if (noise.perlin2((x+1)/5,(z+1)/5) >= 0){
        //   textureUrl = grass1Url
        // }else{
        //   textureUrl = dirt1Url
        // }
        window.gameObjects.push({
          key: `initBlock:${x},${y},${z}:1`,
          textureUrl: textureUrl,

          p1x: x+1,
          p1y: 3*noise.perlin2((x+1)/10,(z+1)/10),
          p1z: z+1,

          p3x: x+1,
          p3y: 3*noise.perlin2((x+1)/10,z/10),
          p3z: z,

          p2x: x,
          p2y: 3*noise.perlin2(x/10,(z+1)/10),
          p2z: z+1,

          uv1x: 1.0,
          uv1y: 1.0,

          uv3x: 1.0,
          uv3y: 0.0,

          uv2x: 0.0,
          uv2y: 1.0,

          weightChance: Math.random(),
        });
        if (Math.sqrt(x**2+z**2) > 15 && noise.perlin2(x/5,z/5) < 0 && random() > 0.9){
          // Trees
          const ymin = 3*noise.perlin2(x/10,z/10)
          const ymax = Math.random()*5+2
          for (let y2 = 0; y2 < ymax; y2++) {
            for (let t = 0; t < 2*Math.PI; t += Math.PI/8) {
              // Bark
              window.gameObjects.push({
                key: `initBlock:${x},${y2},${z},${t}:1`,
                textureUrl: bark1Url,

                p1x: x+Math.sin(t)/(y2+2),
                p1y: ymin + y2,
                p1z: z+Math.cos(t)/(y2+2),

                p3x: x+Math.sin(t+Math.PI/8)/(y2+2),
                p3y: ymin + y2,
                p3z: z+Math.cos(t+Math.PI/8)/(y2+2),

                p2x: x+Math.sin(t+Math.PI/8)/(y2+3),
                p2y: ymin + y2 +1,
                p2z: z+Math.cos(t+Math.PI/8)/(y2+3),

                uv1x: Math.sin(t/2),
                uv1y: 0.0,

                uv3x: Math.sin((t+Math.PI/8)/2),
                uv3y: 0.0,

                uv2x: Math.sin((t+Math.PI/8)/2),
                uv2y: 1.0,

                weightChance: Math.random(),
              });
              // Bark
              window.gameObjects.push({
                key: `initBlock:${x},${y2},${z},${t}:2`,
                textureUrl: bark1Url,

                p1x: x+Math.sin(t)/(y2+2),
                p1y: ymin + y2,
                p1z: z+Math.cos(t)/(y2+2),

                p2x: x+Math.sin(t)/(y2+3),
                p2y: ymin + y2+1,
                p2z: z+Math.cos(t)/(y2+3),

                p3x: x+Math.sin(t+Math.PI/8)/(y2+3),
                p3y: ymin + y2+1,
                p3z: z+Math.cos(t+Math.PI/8)/(y2+3),

                uv1x: Math.sin(t/2),
                uv1y: 0.0,

                uv2x: Math.sin(t/2),
                uv2y: 1.0,

                uv3x: Math.sin((t+Math.PI/8)/2),
                uv3y: 1.0,

                weightChance: Math.random(),
              });

              // Leaves
              if (y2 != 0){
                window.gameObjects.push({
                  key: `initBlock:${x},${y},${z}:0`,
                  textureUrl: leaves1Url,
                  p1x: x,
                  p1y: y2+3 + 3*noise.perlin2((x)/10,(z)/10),
                  p1z: z,

                  p3x: x+3*Math.sin(t)/(y2+2),
                  p3y: y2+1 + 3*noise.perlin2(
                                        (x+Math.sin(t)/(y2+1))/10,
                                        (z+Math.cos(t)/(y2+1))/10
                                      ),
                  p3z: z+3*Math.cos(t)/(y2+2),

                  p2x: x+3*Math.sin(t+Math.PI/8)/(y2+2),
                  p2y: y2+1 + 3*noise.perlin2(
                                        (x+Math.sin(t+Math.PI/8)/(y2+1))/10,
                                        (z+Math.cos(t+Math.PI/8)/(y2+1))/10
                                      ),
                  p2z: z+3*Math.cos(t+Math.PI/8)/(y2+2),

                  uv1x: 0.0,
                  uv1y: 0.0,

                  uv3x: 1.0,
                  uv3y: 0.0,

                  uv2x: 0.0,
                  uv2y: 1.0,
                  weightChance: Math.random(),
                });
              }
            }
          }
        }else if (Math.sqrt(x**2+z**2) > 15 && noise.perlin2(x/5,z/5) > 0 && random() > 0.99){
          // cssObjectsArray.push(
          //   create3dPage(
          //     1500,
          //     100 + 1000,
          //     0.001,
          //     new THREE.Vector3(x, Math.floor(3*noise.perlin2(x/10,z/10))+2, z),
          //     new THREE.Vector3(0, 2*Math.random()*Math.PI, 0),
          //     `https://courseware.cemc.uwaterloo.ca/11/assignments/63/${id}`,
          //     ""
          //   )
          // );
          // for (let x2 = -2; x2 < 2; x2++) {
          //   for (let y2 = 0; y2 <= 1; y2++) {
          //     for (let z2 = -2; z2 <= 2; z2 += 4) {
          //       window.gameObjects.push({
          //         key: `initBlock:${x},${y},${z}:0`,
          //         textureUrl: wood1Url,
          //         p1x: x+x2,
          //         p1y: y2 + Math.floor(3*noise.perlin2((x+x2)/10,(z+z2)/10)),
          //         p1z: z+z2,

          //         p3x: x+x2+1,
          //         p3y: y2 + Math.floor(3*noise.perlin2((x+x2+1)/10,(z+z2)/10)),
          //         p3z: z+z2,

          //         p2x: x+x2,
          //         p2y: y2 + 1 + Math.floor(3*noise.perlin2((x+x2)/10,(z+z2)/10)),
          //         p2z: z+z2,

          //         uv1x: 0.0,
          //         uv1y: 0.0,

          //         uv3x: 1.0,
          //         uv3y: 0.0,

          //         uv2x: 0.0,
          //         uv2y: 1.0,
          //         weightChance: Math.random(),
          //       });
          //       window.gameObjects.push({
          //         key: `initBlock:${x},${y},${z}:0`,
          //         textureUrl: wood1Url,
          //         p1x: x+x2 + 1,
          //         p1y: y2 + 1 + Math.floor(3*noise.perlin2((x+x2+1)/10,(z+z2)/10)),
          //         p1z: z+z2,

          //         p2x: x+x2+1,
          //         p2y: y2 + Math.floor(3*noise.perlin2((x+x2+1)/10,(z+z2)/10)),
          //         p2z: z+z2,

          //         p3x: x+x2,
          //         p3y: y2 + 1 + Math.floor(3*noise.perlin2((x+x2)/10,(z+z2)/10)),
          //         p3z: z+z2,

          //         uv1x: 1.0,
          //         uv1y: 1.0,

          //         uv2x: 1.0,
          //         uv2y: 0.0,

          //         uv3x: 0.0,
          //         uv3y: 1.0,
          //         weightChance: Math.random(),
          //       });
          //     }
          //   }
          // }
          // for (let x2 = -2; x2 <= 2; x2 += 4) {
          //   for (let y2 = 0; y2 <= 1; y2++) {
          //     for (let z2 = -2; z2 < 2; z2++) {
          //       window.gameObjects.push({
          //         key: `initBlock:${x},${y},${z}:0`,
          //         textureUrl: wood1Url,
          //         p1x: x+x2,
          //         p1y: y2 + Math.floor(3*noise.perlin2((x+x2)/10,(z+z2)/10)),
          //         p1z: z+z2,

          //         p2x: x+x2,
          //         p2y: y2 + Math.floor(3*noise.perlin2((x+x2)/10,(z+z2+1)/10)),
          //         p2z: z+z2+1,

          //         p3x: x+x2,
          //         p3y: y2 + 1 + Math.floor(3*noise.perlin2((x+x2)/10,(z+z2)/10)),
          //         p3z: z+z2,

          //         uv1x: 0.0,
          //         uv1y: 0.0,

          //         uv2x: 1.0,
          //         uv2y: 0.0,

          //         uv3x: 0.0,
          //         uv3y: 1.0,
          //         weightChance: Math.random(),
          //       });
          //       window.gameObjects.push({
          //         key: `initBlock:${x},${y},${z}:0`,
          //         textureUrl: wood1Url,
          //         p1x: x+x2,
          //         p1y: y2 + 1 + Math.floor(3*noise.perlin2((x+x2)/10,(z+z2 + 1)/10)),
          //         p1z: z+z2 + 1,

          //         p3x: x+x2,
          //         p3y: y2 + Math.floor(3*noise.perlin2((x+x2)/10,(z+z2+1)/10)),
          //         p3z: z+z2+1,

          //         p2x: x+x2,
          //         p2y: y2 + 1 + Math.floor(3*noise.perlin2((x+x2)/10,(z+z2)/10)),
          //         p2z: z+z2,

          //         uv1x: 1.0,
          //         uv1y: 1.0,

          //         uv3x: 1.0,
          //         uv3y: 0.0,

          //         uv2x: 0.0,
          //         uv2y: 1.0,
          //         weightChance: Math.random(),
          //       });
          //     }
          //   }
          // }
          // for (let x2 = -2; x2 < 2; x2++) {
          //   for (let y2 = 2; y2 <= 2; y2++) {
          //     for (let z2 = -2; z2 < 2; z2++) {
          //       window.gameObjects.push({
          //         key: `initBlock:${x},${y},${z}:0`,
          //         textureUrl: wood1Url,
          //         p1x: x+x2,
          //         p1y: y2 + Math.floor(3*noise.perlin2((x+x2)/10,(z+z2)/10)),
          //         p1z: z+z2,

          //         p3x: x+x2,
          //         p3y: y2 + Math.floor(3*noise.perlin2((x+x2)/10,(z+z2+1)/10)),
          //         p3z: z+z2+1.0,

          //         p2x: x+x2+1,
          //         p2y: y2 + Math.floor(3*noise.perlin2((x+x2+1)/10,(z+z2)/10)),
          //         p2z: z+z2,

          //         uv1x: 0.0,
          //         uv1y: 0.0,

          //         uv3x: 1.0,
          //         uv3y: 0.0,

          //         uv2x: 0.0,
          //         uv2y: 1.0,
          //         weightChance: Math.random(),
          //       });
          //       window.gameObjects.push({
          //         key: `initBlock:${x},${y},${z}:0`,
          //         textureUrl: wood1Url,
          //         p1x: x+x2+1,
          //         p1y: y2 + Math.floor(3*noise.perlin2((x+x2+1)/10,(z+z2 + 1)/10)),
          //         p1z: z+z2 + 1,

          //         p2x: x+x2,
          //         p2y: y2 + Math.floor(3*noise.perlin2((x+x2)/10,(z+z2+1)/10)),
          //         p2z: z+z2+1,

          //         p3x: x+x2+1,
          //         p3y: y2 + Math.floor(3*noise.perlin2((x+x2+1)/10,(z+z2)/10)),
          //         p3z: z+z2,

          //         uv1x: 1.0,
          //         uv1y: 1.0,

          //         uv2x: 1.0,
          //         uv2y: 0.0,

          //         uv3x: 0.0,
          //         uv3y: 1.0,
          //         weightChance: Math.random(),
          //       });
          //     }
          //   }
          // }
        }
      }
    }
  }

  $('body').on('click', '.showSignUp', function(event) {
    $.ajax({
      url: '/accounts/signup/',
      type: 'GET',
      success: function(resp) {
        $("#login").html(resp)
      }
    })
  })

  $('body').on('click', '.showLogIn', function(event) {
    $.ajax({
      url: '/accounts/login/',
      type: 'GET',
      success: function(resp) {
        $("#login").html(resp)
      }
    })
  })

  $('body').on('click', '.temporaryUsernameRefresh', function(event) {
    window.location.search = "?name="+$('input[name="temporary-name"]').val()
  })

  // if (isLoggedIn == false){
  //   $.ajax({
  //       url: '/my_login/',
  //       type: 'GET',
  //       success: function(resp) {
  //         cssObjectsArray.push(
  //           create3dPage(
  //             400,
  //             600,
  //             0.004,
  //             new THREE.Vector3(0, -0.5, -2),
  //             new THREE.Vector3(0, 0, 0),
  //             ``,
  //             "<div id='login'>"+resp+"</div>"
  //           )
  //         );
  //         parseScript(resp)
  //       }
  //   })
  // }else{
  //   $.ajax({
  //       url: '/settings/',
  //       type: 'GET',
  //       success: function(resp) {
  //         cssObjectsArray.push(
  //           create3dPage(
  //             400,
  //             600,
  //             0.004,
  //             new THREE.Vector3(0, -0.5, -2),
  //             new THREE.Vector3(0, 0, 0),
  //             ``,
  //             "<div id='settings'>"+resp+"</div>"
  //           )
  //         );
  //       }
  //   })
  // }

  // $.ajax({
  //   url: '/trixie/',
  //   type: 'GET',
  //   success: function(resp) {
  //     cssObjectsArray.push(
  //       create3dPage(
  //         400,
  //         600,
  //         0.004,
  //         new THREE.Vector3(2, -0.5, -2),
  //         new THREE.Vector3(0, 0, 0),
  //         ``,
  //         "<div id='trixie'>"+resp+"</div>"
  //       )
  //     );
  //   }
  // })
  // cssObjectsArray.push(
  //   create3dPage(
  //     600,
  //     1200,
  //     0.002,
  //     new THREE.Vector3(1.5, -0.5, -2),
  //     new THREE.Vector3(0, 0, 0),
  //     `/trixie/`,
  //     ""
  //   )
  // );

  cssObjectsArray.push(
    create3dPage(
      1000,
      1200,
      0.002,
      new THREE.Vector3(0, 0.5, -4),
      new THREE.Vector3(0, 0, 0),
      "https://courseware.cemc.uwaterloo.ca/",
      ""
    )
  );

  // cssObjectsArray.push(
  //   create3dPage(
  //     500,
  //     500,
  //     0.01,
  //     new THREE.Vector3(0, 0, -9),
  //     new THREE.Vector3(0, 0, 0),
  //     "",
  //     "<div id='map' style='width:500px; height:500px;'></div>"
  //   )
  // );
  

  // cssObjectsArray.push(
  //   create3dPage(
  //     1000,
  //     1200,
  //     0.002,
  //     new THREE.Vector3(5.3, -0.5, -2),
  //     new THREE.Vector3(0, 0, 0),
  //     "/api/v1/",
  //     ""
  //   )
  // );

  // for (let x = 0; x < 5; x++) {
  //   for (let y = -2; y < 0; y++) {
  //     for (let z = 0; z < 4; z++) {
  //       id = y+5;//Math.floor(10 * Math.random())+100;
  //       window.gameObjects.push({
  //         key: `initBlock:${x},${y},${z}:0`,
  //         x: x,
  //         y: y,
  //         z: z,
  //         // lnglat: GEOPOS.projectionHigh.invert([x, z]),
  //         altitude: y,
  //         textureUrl: `https://picsum.photos/id/${id}/256/256`,
  //         colorPicker: colorPicker.pop(),
  //         rotationX: 0.0,
  //         rotationY: 0.0,
  //         rotationZ: 0.0,
  //         uv1x: 1.0,
  //         uv1y: 1.0,
  //         uv2x: 0.0,
  //         uv2y: 1.0,
  //         uv3x: 1.0,
  //         uv3y: 0.0,
  //         weightChance: Math.random(),
  //       });
  //       window.gameObjects.push({
  //         key: `initBlock:${x},${y},${z}:1`,
  //         x: x,
  //         y: y,
  //         z: z,
  //         // lnglat: GEOPOS.projectionHigh.invert([x, z]),
  //         altitude: y,
  //         textureUrl: `https://picsum.photos/id/${id}/256/256`,
  //         colorPicker: colorPicker.pop(),
  //         rotationX: 0.0,
  //         rotationY: Math.PI,
  //         rotationZ: 0.0,

  //         uv1x: 0.0,
  //         uv1y: 0.0,
  //         uv2x: 1.0,
  //         uv2y: 0.0,
  //         uv3x: 0.0,
  //         uv3y: 1.0,
  //         weightChance: Math.random(),
  //       });
  //     }
  //   }
  // }
  // for (let x = 0; x < 5; x++) {
  //   for (let y = -2; y < 0; y++) {
  //     for (let z = 4; z < 5; z++) {
  //       id = y+5;//Math.floor(10 * Math.random())+100;
  //       window.gameObjects.push({
  //         key: `initBlock:${x},${y},${z}:0`,
  //         x: x,
  //         y: y,
  //         z: z,
  //         // lnglat: GEOPOS.projectionHigh.invert([x, z]),
  //         altitude: y,
  //         textureUrl: `https://picsum.photos/id/${id}/256/256`,
  //         colorPicker: colorPicker.pop(),
  //         rotationX: Math.PI/4,
  //         rotationY: 0.0,
  //         rotationZ: 0.0,
  //         uv1x: 1.0,
  //         uv1y: 1.0,
  //         uv2x: 0.0,
  //         uv2y: 1.0,
  //         uv3x: 1.0,
  //         uv3y: 0.0,
  //         weightChance: Math.random(),
  //       });
  //       window.gameObjects.push({
  //         key: `initBlock:${x},${y},${z}:1`,
  //         x: x,
  //         y: y-1/4,
  //         z: z,
  //         // lnglat: GEOPOS.projectionHigh.invert([x, z]),
  //         altitude: y,
  //         textureUrl: `https://picsum.photos/id/${id}/256/256`,
  //         colorPicker: colorPicker.pop(),
  //         rotationX: Math.PI/4,
  //         rotationY: Math.PI,
  //         rotationZ: 0.0,

  //         uv1x: 0.0,
  //         uv1y: 0.0,
  //         uv2x: 1.0,
  //         uv2y: 0.0,
  //         uv3x: 0.0,
  //         uv3y: 1.0,
  //         weightChance: Math.random(),
  //       });
  //     }
  //   }
  // }
  // for (let x = -127; x < 127; x++) {
  //   for (let y = -1; y < 127; y++) {
  //     for (let z = -1; z < 0; z++) {
  //       id = Math.floor(25 * Math.random())+10;
  //       window.gameObjects.push({
  //         key: `initBlock:${x},${y},${z}:2`,
  //         x: x,
  //         y: y,
  //         z: z,
  //         // lnglat: GEOPOS.projectionHigh.invert([x, z]),
  //         altitude: y,
  //         textureUrl: `https://picsum.photos/id/${id}/256/256`,
  //         colorPicker: colorPicker.pop(),
  //         rotationX: Math.PI/2,
  //         rotationY: -Math.PI/2,
  //         rotationZ: 0.0,
  //         weightChance: Math.random(),
  //       });
  //       window.gameObjects.push({
  //         key: `initBlock:${x},${y},${z}:3`,
  //         x: x,
  //         y: y,
  //         z: z,
  //         // lnglat: GEOPOS.projectionHigh.invert([x, z]),
  //         altitude: y,
  //         textureUrl: `https://picsum.photos/id/${id}/256/256`,
  //         colorPicker: colorPicker.pop(),
  //         rotationX: Math.PI/2,
  //         rotationY: Math.PI/2,
  //         rotationZ: 0.0,
  //         weightChance: Math.random(),
  //       });
  //     }
  //   }
  // }
  // for (let x = 127; x < 128; x++) {
  //   for (let y = -1; y < 127; y++) {
  //     for (let z = -1; z < 127; z++) {
  //       id = Math.floor(10 * Math.random())+100;
  //       window.gameObjects.push({
  //         key: `initBlock:${x},${y},${z}:2`,
  //         x: x,
  //         y: y,
  //         z: z,
  //         // lnglat: GEOPOS.projectionHigh.invert([x, z]),
  //         altitude: y,
  //         textureUrl: `https://picsum.photos/id/${id}/256/256`,
  //         colorPicker: colorPicker.pop(),
  //         rotationX: 0.0,
  //         rotationY: 0.0,
  //         rotationZ: Math.PI/2,
  //         weightChance: Math.random(),
  //       });
  //       window.gameObjects.push({
  //         key: `initBlock:${x},${y},${z}:3`,
  //         x: x,
  //         y: y,
  //         z: z,
  //         // lnglat: GEOPOS.projectionHigh.invert([x, z]),
  //         altitude: y,
  //         textureUrl: `https://picsum.photos/id/${id}/256/256`,
  //         colorPicker: 2.0, //colorPicker.pop(),
  //         rotationX: Math.PI,
  //         rotationY: 0.0,
  //         rotationZ: Math.PI/2,
  //         weightChance: Math.random(),
  //       });
  //     }
  //   }
  // }
  // for (let x = -64; x < 64; x++) {
  //   for (let y = -64; y < 64; y++) {
  //     for (let z = -64; z < 64; z++) {
  //       // window.myMatrix.push([`initBlock:${x},${y},${z}`, x, y, z])
  //       id = Math.floor(10 * Math.random())+100;
  //       window.gameObjects.push({
  //         key: `initBlock:${x},${y},${z}`,
  //         x: x,
  //         y: y,
  //         z: z,
  //         // lnglat: GEOPOS.projectionHigh.invert([x, z]),
  //         altitude: y,
  //         textureUrl: `https://picsum.photos/id/${id}/256/256`,
  //         colorPicker: colorPicker.pop(),
  //         rotationX: (Math.random()-1/2)*(Math.PI),
  //         rotationY: (Math.random()-1/2)*(Math.PI),
  //         rotationZ: (Math.random()-1/2)*(Math.PI),
  //         weightChance: Math.random(),
  //       });
  //     }
  //   }
  // }
  // let x = 0;
  // let y = 1;
  // let z = -2;
  // id = y+5;//Math.floor(10 * Math.random())+100;
  // window.gameObjects.push({
  //   key: `initBlock:${x},${y},${z}:0`,
  //   p1x: x,
  //   p1y: y,
  //   p1z: z,
  //   p2x: x+1,
  //   p2y: y,
  //   p2z: z,
  //   p3x: x,
  //   p3y: y,
  //   p3z: z+1,
  //   // lnglat: GEOPOS.projectionHigh.invert([x, z]),
  //   altitude: y,
  //   textureUrl: grass1Url,
  //   colorPicker: colorPicker.pop(),
  //   rotationX: Math.PI/4,
  //   rotationY: 0.0,
  //   rotationZ: 0.0,
  //   uv1x: 0.0,
  //   uv1y: 0.5,
  //   uv2x: 1.0,
  //   uv2y: 0.5,
  //   uv3x: 0.0,
  //   uv3y: 0.0,
  //   weightChance: 1.0,
  // });
  // window.gameObjects.push({
  //   key: `initBlock:${x},${y},${z}:1`,
  //   p1x: x,
  //   p1y: y,
  //   p1z: z,
  //   p2x: x+1,
  //   p2y: y,
  //   p2z: z,
  //   p3x: x,
  //   p3y: y+1,
  //   p3z: z,
  //   // lnglat: GEOPOS.projectionHigh.invert([x, z]),
  //   altitude: y,
  //   textureUrl: grass1Url,
  //   colorPicker: colorPicker.pop(),
  //   rotationX: Math.PI/4,
  //   rotationY: Math.PI,
  //   rotationZ: 0.0,

  //   uv1x: 0.0,
  //   uv1y: 0.5,
  //   uv2x: 1.0,
  //   uv2y: 0.5,
  //   uv3x: 0,
  //   uv3y: 1.0,
  //   weightChance: 0.0,
  // });
  // window.gameObjects.push({
  //   key: `initBlock:${x},${y},${z}:1`,
  //   p1x: x+1,
  //   p1y: y+1,
  //   p1z: z-1,
  //   p2x: x+1,
  //   p2y: y,
  //   p2z: z,
  //   p3x: x,
  //   p3y: y+1,
  //   p3z: z,
  //   // lnglat: GEOPOS.projectionHigh.invert([x, z]),
  //   altitude: y,
  //   textureUrl: grass1Url,
  //   colorPicker: colorPicker.pop(),
  //   rotationX: Math.PI/4,
  //   rotationY: Math.PI,
  //   rotationZ: 0.0,

  //   uv1x: 1.0,
  //   uv1y: 1.0,
  //   uv2x: 1.0,
  //   uv2y: 0.5,
  //   uv3x: 0,
  //   uv3y: 1.0,
  //   weightChance: 0.0,
  // });
  // window.gameObjects.push({
  //   key: `initBlock:${x},${y},${z}:1`,
  //   p1x: x+1,
  //   p1y: y+1,
  //   p1z: z,
  //   p2x: x+1,
  //   p2y: y+1,
  //   p2z: z+1,
  //   p3x: x+1,
  //   p3y: y+2,
  //   p3z: z+1,
  //   // lnglat: GEOPOS.projectionHigh.invert([x, z]),
  //   altitude: y,
  //   textureUrl: `https://picsum.photos/id/${id}/256/256`,
  //   colorPicker: colorPicker.pop(),
  //   rotationX: Math.PI/4,
  //   rotationY: Math.PI,
  //   rotationZ: 0.0,

  //   uv1x: 0.0,
  //   uv1y: 0.0,
  //   uv2x: 1.0,
  //   uv2y: 0.0,
  //   uv3x: 0.0,
  //   uv3y: 1.0,
  //   weightChance: Math.random(),
  // });
  // x = 1;
  // y = 2;
  // z = -1;
  // window.gameObjects.push({
  //   key: `initBlock:${x},${y},${z}`,
  //   lnglat: GEOPOS.projectionHigh.invert([x, z]),
  //   altitude: y,
  //   textureId: Math.floor(2 * Math.random()),
  //   colorPicker: colorPicker.pop()+50000,
  //   rotationZ: 0,
  //   weightChance: Math.random(),
  // });
  // x = 1;
  // y = 3;
  // z = -1;
  // window.gameObjects.push({
  //   key: `initBlock:${x},${y},${z}`,
  //   lnglat: GEOPOS.projectionHigh.invert([x, z]),
  //   altitude: y,
  //   textureId: Math.floor(2 * Math.random()),
  //   colorPicker: colorPicker.pop(),
  //   rotationZ: 0,
  //   weightChance: Math.random(),
  // });
  // x = 1;
  // y = 4;
  // z = -1;
  // window.gameObjects.push({
  //   key: `initBlock:${x},${y},${z}`,
  //   lnglat: GEOPOS.projectionHigh.invert([x, z]),
  //   altitude: y,
  //   textureId: Math.floor(2 * Math.random()),
  //   colorPicker: colorPicker.pop(),
  //   rotationZ: Math.PI,
  //   weightChance: Math.random(),
  // });
}
