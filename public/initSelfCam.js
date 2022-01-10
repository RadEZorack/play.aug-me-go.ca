// navigator.getUserMedia(
//  { video: true, audio: false },
//  async stream => {

//     const localVideo = document.getElementById("local-video");
//      localVideo.onloadedmetadata = function(e) {
//         localVideo.play();
//       };
//      if (localVideo) {
//        localVideo.srcObject = stream;
//      }
//  },
//  error => {
//    console.warn(error.message);
//  })

let videoCount = 0;

navigator.mediaDevices.enumerateDevices()
  .then(function(devices) {
    devices.forEach(function(device) {
      console.log(device.kind + ": " + device.label +
                  " id = " + device.deviceId);
      if(device.kind == "videoinput" && videoCount == 0){
        console.log("trying")
        videoCount += 1;
        navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: device.deviceId } } })
          .then(function(stream) {
            const localVideo = document.getElementById("local-video-"+videoCount.toString());
            console.log(localVideo);
            localVideo.onloadedmetadata = function(e) {
                localVideo.play();
            };
            if (localVideo) {
               localVideo.srcObject = stream;
            }
          }).catch(function(err) {
             console.log(err.name + ": " + err.message);
          })
      }
      
    });
  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });

// 
