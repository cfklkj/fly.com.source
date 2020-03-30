//--demo from https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext/createMediaStreamSource
var device = device || {};
var devices = device.Method = {  
    init:function(){
        body = util.getEleById("bodys")
        body.innerHTML = ""
        // ele = util.addEle('audio')
        // body.appendChild(ele) 
        ele = util.addEle('video')
        ele.setAttribute("controls", "")
        body.appendChild(ele)
        ele = util.addEle('input')
        ele.setAttribute("type", "range")
        ele.setAttribute("min", "1")
        ele.setAttribute("max", "400")
        body.appendChild(ele) 
        ele = util.addEle('ul') 
        body.appendChild(ele)
    },
    palyAudioV2:function(){
        const myAudio = document.querySelector('audio'); 
const video = document.querySelector('video'); 
const range = document.querySelector('input');
const freqResponseOutput = document.querySelector('ul');
// create float32 arrays for getFrequencyResponse
const myFrequencyArray = new Float32Array(5);
myFrequencyArray[0] = 1000;
myFrequencyArray[1] = 2000;
myFrequencyArray[2] = 3000;
myFrequencyArray[3] = 4000;
myFrequencyArray[4] = 5000;
const magResponseOutput = new Float32Array(5);
const phaseResponseOutput = new Float32Array(5);
// getUserMedia block - grab stream
// put it into a MediaStreamAudioSourceNode
// also output the visuals into a video element
if (navigator.mediaDevices) {
    console.log('getUserMedia supported.');
    navigator.mediaDevices.getUserMedia ({audio: true, video: true})
    .then(function(stream) {
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
            video.play();
            video.muted = true;
        };
        // Create a MediaStreamAudioSourceNode
        // Feed the HTMLMediaElement into it
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        // Create a biquadfilter
        const biquadFilter = audioCtx.createBiquadFilter();
        biquadFilter.type = "lowshelf";
        biquadFilter.frequency.value = 1000;
        biquadFilter.gain.value = range.value;
        // connect the AudioBufferSourceNode to the gainNode
        // and the gainNode to the destination, so we can play the
        // music and adjust the volume using the mouse cursor
        source.connect(biquadFilter);
        biquadFilter.connect(audioCtx.destination);
        // Get new mouse pointer coordinates when mouse is moved
        // then set new gain value
        range.oninput = function() {
            biquadFilter.gain.value = range.value;
        }
        function calcFrequencyResponse() {
            biquadFilter.getFrequencyResponse(myFrequencyArray,magResponseOutput,phaseResponseOutput);
            for (i = 0; i <= myFrequencyArray.length-1;i++){
                let listItem = document.createElement('li');
                listItem.innerHTML = '' + myFrequencyArray[i] + 'Hz: Magnitude ' + magResponseOutput[i] + ', Phase ' + phaseResponseOutput[i] + ' radians.';
                freqResponseOutput.appendChild(listItem);
            }
        }
        calcFrequencyResponse();
    })
    .catch(function(err) {
        console.log('The following gUM error occured: ' + err);
    });
} else {
    console.log('getUserMedia not supported on your browser!');
}
    },
    playVideo:function(stream){
        var video = document.getElementById('webcam');

        if (window && window.URL) {
            video.src = window.URL.createObjectURL(stream);
        } else {
            video.src = stream;
        } 
        video.autoplay = true;
        //or video.play();
    },
    palyAudio:function(stream) {

        //创建一个音频环境对像
        audioContext = window.AudioContext || window.webkitAudioContext;
        context = new audioContext();
        console.log(context)
        //将声音输入这个对像
        if (context.createMediaStreamSources == null){
            console.log("context.createMediaStreamSources - nil")
            return
        }
        audioInput = context.createMediaStreamSources(stream);
        
        //设置音量节点
        volume = context.createGain();
        audioInput.connect(volume);
    
        //创建缓存，用来缓存声音
        var bufferSize = 2048;
    
        // 创建声音的缓存节点，createJavaScriptNode方法的
        // 第二个和第三个参数指的是输入和输出都是双声道。
        recorder = context.createJavaScriptNode(bufferSize, 2, 2);
    
        // 录音过程的回调函数，基本上是将左右两声道的声音
        // 分别放入缓存。
        recorder.onaudioprocess = function(e){
            console.log('recording');
            var left = e.inputBuffer.getChannelData(0);
            var right = e.inputBuffer.getChannelData(1);
            // we clone the samples
            leftchannel.push(new Float32Array(left));
            rightchannel.push(new Float32Array(right));
            recordingLength += bufferSize;
        }
    
        // 将音量节点连上缓存节点，换言之，音量节点是输入
        // 和输出的中间环节。
        volume.connect(recorder);
    
        // 将缓存节点连上输出的目的地，可以是扩音器，也可以
        // 是音频文件。
        recorder.connect(context.destination); 
    
    }
}