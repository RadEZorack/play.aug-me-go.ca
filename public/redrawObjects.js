function redrawObjects() {
  let transformObject = new THREE.Object3D();
  // console.log("starting fetchAndDeleteObjects", window.playerLonLat);
  // const allBlocks = window.gameObjects;

  const length = Math.min(window.gameObjects.length, drawInstances);



  for (const key in triangleMeshs){
      // window.objectScene.remove(triangleMeshs[key].mesh);
      triangleMeshs[key].mesh.count = 0;
      triangleMeshs[key]['j'] = 0;
      triangleMeshs[key]['j2'] = 0;
      triangleMeshs[key]['k'] = 0;
  }

  let visibleCount = 0;

  for (let i = 0, il = length; i < il; i++) {
    const gameObject = window.gameObjects[i]
      // visibleCount += 1;
      // if (visibleCount > instances){
      //   break
      // }
      let triangleMesh = undefined;
      if (gameObject.textureUrl in triangleMeshs){
        triangleMesh = triangleMeshs[gameObject.textureUrl]['mesh']
        // console.log("hit", triangleMesh)
      }else{
        const texture = new THREE.TextureLoader().load( gameObject.textureUrl )
        // let texture = undefined;
        // if (gameObject.textureId == 0.0){
        //   texture = new THREE.TextureLoader().load( wood1Url )
        // }else if (gameObject.textureId == 1.0){
        //   texture = new THREE.TextureLoader().load( grass1Url )
        // }else if (gameObject.textureId == 2.0){
        //   texture = new THREE.TextureLoader().load( bark1Url )
        // }else if (gameObject.textureId == 3.0){
        //   texture = new THREE.TextureLoader().load( leaves1Url )
        // }
        const triangleUniforms = THREE.UniformsUtils.merge([
                                    THREE.UniformsLib.shadowmap,
                                    THREE.UniformsLib.lights,
                                    THREE.UniformsLib.ambient,
                                    THREE.UniformsLib.common,
                                    THREE.UniformsLib.specularmap,
                                    THREE.UniformsLib.envmap,
                                    THREE.UniformsLib.aomap,
                                    THREE.UniformsLib.lightmap,
                                    THREE.UniformsLib.emissivemap,
                                    THREE.UniformsLib.fog,
                                    {
                                        texture: { type:'t', value: null }, // See why this is null https://www.bountysource.com/issues/30181245-three-uniformsutils-merge-shoudnt-clone-the-texture
                                    },
                                ])
        triangleUniforms.texture.value = texture;
        const triangleMaterial = new THREE.ShaderMaterial({
          uniforms: triangleUniforms,
          vertexShader: vs,
          fragmentShader: fs
        });
        triangleMaterial.lights = true;
        // triangleMaterial.side = THREE.DoubleSide;
        const triangleGeometry = new THREE.BufferGeometry();

        // const triangleUVs2 = new Float32Array( [
        //     0.0, 0.0,
        //     1.0, 0.0,
        //     1.0, 1.0
        // ] );
        // const triangleColor = new Float32Array( [0.0, 0.0, 0.0, 0.0] )

        triangleGeometry.setAttribute( 'position', new THREE.BufferAttribute( triangleVertices, 3 ) );
        triangleGeometry.setAttribute( 'normal', new THREE.BufferAttribute( triangleNormals, 3 ) );
        triangleGeometry.setAttribute( 'uv', new THREE.BufferAttribute( triangleUVs, 2 ) );
        // triangleGeometry.setAttribute( 'isColorPicker', new THREE.BufferAttribute( triangleColorPickers, 1 ) );
        // triangleGeometry.setAttribute( 'offset', new THREE.InstancedBufferAttribute( new Float32Array(triangleOffsets), 3 ) );
        // triangleGeometry.setAttribute( 'uvalt', new THREE.BufferAttribute( new Float32Array(triangleUvs), 2 ) );
        // triangleGeometry.setAttribute( 'rgba', new THREE.InstancedBufferAttribute( new Float32Array(triangleRgbas), 4 ) );
        triangleMesh = new THREE.InstancedMesh( triangleGeometry, triangleMaterial, length);
        triangleMesh.castShadow = true;
        triangleMesh.receiveShadow = true;
        // triangleMesh.instanceUVMatrix = new THREE.BufferAttribute( new Float32Array( length * 16 ), 16 );
        triangleMesh.position.y = -window.playerY;
        triangleMesh.count = 0;
        triangleMeshs[gameObject.textureUrl] = {"mesh": triangleMesh, "j": 0, "j2": 0, "k": 0};
        // console.log('triangleMesh', triangleMesh)
        window.objectScene.add(triangleMesh);
        window.triangleMeshInstanceIDKeys[triangleMesh.uuid] = {}
      }

      // if (!(triangleMesh.uuid in window.triangleMeshInstanceIDKeys)){
      //     window.triangleMeshInstanceIDKeys[triangleMesh.uuid] = {}
      // }

      let j = triangleMesh.count
      let k = triangleMesh.count

      // Only do the work if key doesn't match the index.
      // if(window.triangleMeshInstanceIDKeys[triangleMesh.uuid][i] != triangleMesh.count){
        let matrix = new THREE.Matrix4();
        matrix.set( gameObject.p2x - gameObject.p1x, 0, gameObject.p3x - gameObject.p1x, gameObject.p1x,
                    gameObject.p2y - gameObject.p1y, 1, gameObject.p3y - gameObject.p1y, gameObject.p1y,
                    gameObject.p2z - gameObject.p1z, 0, gameObject.p3z - gameObject.p1z, gameObject.p1z,
                    0,                               0, 0,                               1  );
        triangleMesh.setMatrixAt(j++, matrix);
        triangleMesh.instanceMatrix.needsUpdate = true;


        matrix.set(
                    1, 0, 0, 0,
                    0, 1, 0, 1,
                    0, 0, 1, 0,
                    0, 0, 0, 1  );

        matrix.toArray( triangleMesh.instanceNormalMatrix.array, k * 16 );
        triangleMesh.instanceNormalMatrix.needsUpdate = true;


        // transformObject.position.set(1.0, 1.0, 0.0);
        // transformObject.scale.set(1.0, 1.0, 1.0);
        // transformObject.rotation.set(0.0, 0.0, 0.0)
        // // console.log(allBlocks[i].rotationZ)
        // transformObject.updateMatrix();
        matrix.set( gameObject.uv2x - gameObject.uv1x, gameObject.uv3x - gameObject.uv1x, 0, gameObject.uv1x,
                    gameObject.uv2y - gameObject.uv1y, gameObject.uv3y - gameObject.uv1y, 0, gameObject.uv1y,
                    0, 0, 1, 1,
                    0, 0, 0, 1);
        matrix.toArray( triangleMesh.instanceUVMatrix.array, k * 16 );
        triangleMesh.instanceUVMatrix.needsUpdate = true;

        // console.log(allBlocks[i].colorPicker)
        // const color = new THREE.Color(0).setHex( gameObject.colorPicker )

        // triangleMesh.geometry.attributes.rgba.setXYZW( triangleMesh.count, color.r, color.g, color.b, 1.0);
        // triangleMesh.geometry.attributes.rgba.setXYZW( j2+1, color.r, color.g, color.b, 1);
        // triangleMesh.geometry.attributes.rgba.setXYZW( j2+2, color.r, color.g, color.b, 1);
        // triangleMesh.geometry.attributes.rgba.needsUpdate = true;

        // triangleMesh.geometry.attributes.uvalt.count += 1;
        // triangleMesh.geometry.attributes.uvalt.setXY( 3*triangleMesh.count, gameObject.uv1x, gameObject.uv1y);
        // triangleMesh.geometry.attributes.uvalt.setXY( 3*triangleMesh.count+1, gameObject.uv2x, gameObject.uv2y);
        // triangleMesh.geometry.attributes.uvalt.setXY( 3*triangleMesh.count+2, gameObject.uv3x, gameObject.uv3y);
        // triangleMesh.geometry.attributes.uvalt.needsUpdate = true;

        window.triangleMeshInstanceIDKeys[triangleMesh.uuid][triangleMesh.count] = i;
        // window.triangleMeshInstanceIDKeys[triangleMesh.uuid][i] = triangleMesh.count;
      // }

      triangleMesh.count += 1;

  }
  console.log(triangleMeshs)
  for (const key in triangleMeshs){
    if(triangleMeshs[key].mesh.count == 0){
      // Clean up any meshes that don't have instances
      delete triangleMeshs[key];
    }else{

    }
  }

  console.log("finished redrawObjects");
}
