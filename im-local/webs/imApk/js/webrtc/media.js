'use strict';
/****************************************************************************
* User media (webcam)
step:
1.medias.grabWebCamVideo(true,true)
2.local  -- writeStream
3.from remote  -- readStream
****************************************************************************/


var media = media || {};
var medias = media.Method = {
    video:null,
    stream:null,
    grabWebCamVideo:function(isAudio, isVideo) {
        if (navigator.mediaDevices == null) {
            console.log('navigator.mediaDevices is null');
            return
        }
        console.log('Getting user media (video) ...');
        navigator.mediaDevices.getUserMedia({
        audio: isAudio,
        video: isVideo
        }).then(this.writeStream).catch(this.writeError);
    }, 
    writeError:function(e){
        alert('getUserMedia() errors: ' + e);
    },
    writeStream:function(stream) {
        console.log('getUserMedia video stream URL:', stream);
        medias.stream = stream 
        channelStreamWrite.send(stream) 
        var body = util.getEleById("bodys") 
        var ele = util.addEle('video')  
        body.appendChild(ele) 
        ele.srcObject = stream;  
        ele.onloadedmetadata = function() {
            ele.play();
            console.log('gotStream with width and height:')
         };  
        console.log('showRemote.');
    },
    readStream:function(mediaStream){   
        var body = util.getEleById("bodys") 
        var ele = util.addEle('video') 
        //ele.setAttribute("controls", "")
        body.appendChild(ele) 
        ele.srcObject = mediaStream; 
        
        ele.onloadedmetadata = function() {
            ele.play();
            console.log('gotStream with width and height:')
         };  
        console.log('showRemote.');
    }
}
  