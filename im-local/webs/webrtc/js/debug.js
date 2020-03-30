var debug = debug || {};
var debugs = debug.Method = {  
    init:function(){
        setConsolePrint("debug") 
        this.check()
    },
    check:function(){
        devices.init()
        devices.palyAudioV2()
        return
        navigator.getUserMedia || 
        (navigator.getUserMedia = navigator.mozGetUserMedia ||  navigator.webkitGetUserMedia || navigator.msGetUserMedia);

        if (navigator.getUserMedia) {
            //do something
            console.log('check passed')
            navigator.getUserMedia({
                video: false,
                audio: true
            }, devices.palyAudio, this.onError); 
        } else {
            devices.palyAudioV2()
            console.log('your browser not support getUserMedia');
        }
    },
    onError:function(code){
        console.log(code)
    }
}