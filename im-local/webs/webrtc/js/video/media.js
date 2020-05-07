'use strict';
/****************************************************************************
* User media (webcam)
****************************************************************************/


var media = media || {};
var medias = media.Method = {
    video:null,
    grabWebCamVideo:function() {
        if (navigator.mediaDevices == null) {
            console.log('navigator.mediaDevices is null');
            return
        }
        console.log('Getting user media (video) ...');
        navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
        }).then(this.gotStream).catch(this.gotError);
    }, 
    gotError:function(e){
        alert('getUserMedia() errors: ' + e);
    },
    gotStream:function(stream) {
        console.log('getUserMedia video stream URL:', stream);
       // window.stream = stream; // stream available to console
        medias.video.srcObject = stream;
        medias.video.onloadedmetadata = function() {
           // medias.video.play();
            console.log('gotStream with width and height:', medias.video.videoWidth, medias.video.videoHeight)
        }; 
    }
}
  