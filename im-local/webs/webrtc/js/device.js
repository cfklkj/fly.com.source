//--demo from https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext/createMediaStreamSource
//read api  https://developer.mozilla.org/en-US/docs/Web/API
var device = device || {};
var devices = device.Method = {   
    audios:null,
    init:function(){
        body = util.getEleById("bodys")
        body.innerHTML = ""
        ele = util.addEle('video')
        body.appendChild(ele) 
        ele = util.addEle('button')
        ele.setAttribute("type", "button")
        ele.innerHTML = "play"
        body.appendChild(ele) 

        navigator.getUserMedia || 
        (navigator.getUserMedia = navigator.mozGetUserMedia ||  navigator.webkitGetUserMedia || navigator.msGetUserMedia);

        if (navigator.getUserMedia) {
            //do something
            console.log('check passed')
            devices.playAudio()
            return
            setTimeout("devices.playAudio()", 2000)
            navigator.getUserMedia({
                video: true,
                audio: true
            }, this.playVideo, debugs.onError); 
        } else {
            devicesV2.init()
            devicesV2.palyAudio()
            console.log('your browser not support getUserMedia');
        }
    },
    playVideo:function(stream){
        var video = document.querySelector('video');

        if (window && window.URL) {
            video.src = window.URL.createObjectURL(stream);
        } else {
            video.src = stream;
        } 
        video.autoplay = true;
        //or video.play();
        devices.palyAudio(stream)
    },
    palyAudio:function(stream) {
 
        //创建一个音频环境对像
        audioContext = window.AudioContext || window.webkitAudioContext;
        context = new audioContext();  
        console.log(context)
        audioInput = context.createMediaStreamSource(stream);  //createMediaStreamSources
        
        //设置音量节点
        volume = context.createGain();
        audioInput.connect(volume);
    
        //创建缓存，用来缓存声音
        var bufferSize = 2048;
    
        // 创建声音的缓存节点，createJavaScriptNode -- createScriptProcessor方法的
        // 第二个和第三个参数指的是输入和输出都是双声道。
        recorder = context.createScriptProcessor(bufferSize, 2, 2);
    
        // 录音过程的回调函数，基本上是将左右两声道的声音
        // 分别放入缓存。
        recorder.onaudioprocess = function(e){
            var left = e.inputBuffer.getChannelData(0);
            var right = e.inputBuffer.getChannelData(1);
            console.log('recording'); 
            // we clone the samples
            //leftchannel.push(new Float32Array(left));
            //rightchannel.push(new Float32Array(right));
           // recordingLength += bufferSize;
        }
    
        // 将音量节点连上缓存节点，换言之，音量节点是输入
        // 和输出的中间环节。
        volume.connect(recorder);
    
        // 将缓存节点连上输出的目的地，可以是扩音器，也可以
        // 是音频文件。
        recorder.connect(context.destination); 
    
    },
    readBuffer:function(audioData){ 
        devices.audios.decodeAudioData(audioData, function(buffer) {
            myBuffer = buffer;   
            source.buffer = myBuffer;
        },
        function(e){"Error with decoding audio data" + e.err});
    },
    playAudio:function(){ 
        var playButton = document.querySelector('button');
            
        // Create AudioContext and buffer source
        var audioCtx = new AudioContext();
        source = audioCtx.createBufferSource();

        // Create a ScriptProcessorNode with a bufferSize of 4096 and a single input and output channel
        var scriptNode = audioCtx.createScriptProcessor(4096, 2, 2);
        console.log(scriptNode.bufferSize);
        devices.audios = audioCtx
        // audioCtx.decodeAudioData(audioData, function(buffer) {
        //     myBuffer = buffer;   
        //     source.buffer = myBuffer;
        // },
        // function(e){"Error with decoding audio data" + e.err});
        // load in an audio track via XHR and decodeAudioData

        // function getData() {
        // request = new XMLHttpRequest();
        // request.open('GET', 'viper.ogg', true);
        // request.responseType = 'arraybuffer';
        // request.onload = function() {
        //     var audioData = request.response;

        //     audioCtx.decodeAudioData(audioData, function(buffer) {
        //     myBuffer = buffer;   
        //     source.buffer = myBuffer;
        // },
        //     function(e){"Error with decoding audio data" + e.err});
        // }
        // request.send();
        // }

        // Give the node a function to process audio events
        scriptNode.onaudioprocess = function(audioProcessingEvent) {
        // The input buffer is the song we loaded earlier
        var inputBuffer = audioProcessingEvent.inputBuffer;

        // The output buffer contains the samples that will be modified and played
        var outputBuffer = audioProcessingEvent.outputBuffer;

        // Loop through the output channels (in this case there is only one)
        for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
            var inputData = inputBuffer.getChannelData(channel);
            var outputData = outputBuffer.getChannelData(channel);

            // Loop through the 4096 samples
            for (var sample = 0; sample < inputBuffer.length; sample++) {
            // make output equal to the same as the input
            outputData[sample] = inputData[sample];

            // add noise to each output sample
            outputData[sample] += ((Math.random() * 2) - 1) * 0.2;     
            devices.readBuffer(outputData)   
            }
        }
        } 

      //  getData();

        // wire up play button
        playButton.onclick = function() {
        source.connect(scriptNode);
        scriptNode.connect(audioCtx.destination);
        source.start();
        }
            
        // When the buffer source stops playing, disconnect everything
        source.onended = function() {
        source.disconnect(scriptNode);
        scriptNode.disconnect(audioCtx.destination);
        }
    },
}