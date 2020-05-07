'use strict';
/****************************************************************************
* User media (webcam)
step:
0.set medias.onwriteCallback = function(stream){}
2.set medias.onreadCallback = function(stream){} 
3.set medias.setAudio(true)
4.set medias.setVideo(true)
****************************************************************************/ 
var medias = { 
    onwriteCallback:null,
    onreadCallback:null,
    isAudio:false,
    isVideo:false,
    setAudio:function(audio){ 
        if (audio && (audio == true || audio == "true" || audio == "1") ){
            this.isAudio =  true
        }
    },
    setVideo:function(video){ 
        if (video && (video == true || video == "true" || video == "1") ){
            this.isVideo =  true
        }
    },
    openMedia:function() {
        if (navigator == null || navigator.mediaDevices == null) {
            alert('navigator.mediaDevices is null');
            return
        }  
        navigator.mediaDevices.getUserMedia({
        audio: this.isAudio,
        video: this.isVideo
        }).then(this.onwriteCallback).catch(this.writeError);
    }, 
    writeError:function(e){
        alert('getUserMedia() errors: ' + e);
    },
}
  