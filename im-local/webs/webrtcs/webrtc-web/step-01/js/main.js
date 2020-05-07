'use strict';
window.onload=main
function main(){
  setConsolePrint("debug")
  console.log("debug:")
  
// Initializes media stream.
navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
.then(gotLocalMediaStream).catch(handleLocalMediaStreamError);
  localVideo.play()
  console.log("debug:")
}
function setConsolePrint(elId){  
  var logger = document.getElementById(elId);
  console.log = function (message) {
      if (typeof message == 'object') {
          logger.innerHTML += (JSON && JSON.stringify ? JSON.stringify(message) : message) + '<br />';
      } else {
          logger.innerHTML += message + '<br />';
      }
  }
}
// On this codelab, you will be streaming only video (video: true).
const mediaStreamConstraints = {
  video: true,
};

// Video element where stream will be placed.
const localVideo = document.querySelector('video');

// Local stream that will be reproduced on the video.
let localStream;

// Handles success by adding the MediaStream to the video element.
function gotLocalMediaStream(mediaStream) {
  localStream = mediaStream;
  localVideo.srcObject = mediaStream;
}

// Handles error by logging a message to the console with the error message.
function handleLocalMediaStreamError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

