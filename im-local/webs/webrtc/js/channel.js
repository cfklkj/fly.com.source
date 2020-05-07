var rtcChannel = rtcChannel || {};
var channels = rtcChannel.Method = {
    connect:function(){
        var dataChannelOptions = {
            ordered: false, // do not guarantee order
            maxRetransmitTime: 3000, // in milliseconds
        };
        
        var peerConnection = new RTCPeerConnection();
        
        // Establish your peer connection using your signaling channel here
        var dataChannel =
            peerConnection.createDataChannel("myLabel", dataChannelOptions);
        
        dataChannel.onerror = function (error) {
            console.log("Data Channel Error:", error);
        };
        
        dataChannel.onmessage = function (event) {
            console.log("Got Data Channel Message:", event.data);
        };
        
        dataChannel.onopen = function () {
            dataChannel.send("Hello World!");
        };
        
        dataChannel.onclose = function () {
            console.log("The Data Channel is Closed");
        };
    },
}