//--demo from https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext/createMediaStreamSource
var deviceV2 = deviceV2 || {};
var devicesV2 = deviceV2.Method = {  
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
    palyAudio:function(){
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
}