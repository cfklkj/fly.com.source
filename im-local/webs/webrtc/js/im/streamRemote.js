var streamRemote = streamRemote || { 
    peerConn:null, 
    channel:null,
    createPeerConnection: function(config) { 
        console.log('Created local peer connection object localPeerConnection.');
        peerConn = new RTCPeerConnection(config); 
        peerConn.addEventListener('icecandidate', this.handleConnection);
        peerConn.addEventListener(
          'iceconnectionstatechange', this.handleConnectionChange);
        streamRemote.peerConn = peerConn
    }, 
    handleConnection:function (event) {
      console.log("handleConnection -remote")
      // Connects with new peer candidate.
      const peerConnection = event.target;
      const iceCandidate = event.candidate; 
      if (iceCandidate) {
        if (!streamChange.isOtherPeer(peerConnection)) { 
            console.log("send to other ice")
            ims.tallMsg(p2ps.to,{
              type: 'candidate', 
              isAnswer:true,
              candidate: event.candidate
              }, imDefine.P2P); 
        } 
      }
    },
    listenStream:function(){ 
      console.log('Added   remotePeerConn.');
      streamRemote.peerConn.addEventListener('addstream', gotRemoteMediaStream);
    },
    createReceive:function (description){ 
      console.log('Remote peer connection received remote description.');
      console.log(description) 
      streamRemote.peerConn.setRemoteDescription(description)
        .then(() => { 
          console.log('remotePeerConnection createAnswer start.');
          streamRemote.peerConn.createAnswer()
            .then(streamRemote.createdAnswer)
            .catch(streamChange.logError); 
        }).catch(streamChange.logError); 
    },
    // Logs answer to offer creation and sets peer connection session descriptions.
    createdAnswer:function(description) {
      console.log('Remote peer connection answer remote description.');
      console.log(description) 
      streamRemote.peerConn.setLocalDescription(description)
        .then(() => {  
          ims.tallMsg(p2ps.to,{
            type: 'descriptionAnswer',
            description: description
            }, imDefine.P2P);
        }).catch(streamChange.logError);  
    },
    addCandidate:function(iceCandidate){
      const newIceCandidate = new RTCIceCandidate(iceCandidate); 
      streamRemote.peerConn.addIceCandidate(newIceCandidate)
        .then(() => { 
          console.log(`remote ICE candidate:\n` +
          `${iceCandidate}.`);
        }).catch(streamChange.logError); 
    },
    
} 
 // Handles remote MediaStream success by adding it as the remoteVideo src.
function gotRemoteMediaStream(event) { 
  console.log('Remote peer connection received remote stream.');
  console.log(event)
  console.log(event.stream)
  takePhotos.showRemote(event.stream)
}