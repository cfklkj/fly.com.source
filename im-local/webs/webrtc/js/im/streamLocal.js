
/****************************************************************************
* WebRTC peer connection and data channel
****************************************************************************/

var streamLocal = streamLocal || {
    peerConn:null,   
    to:null, 
    isOffer:false,
    createPeerConnection: function(config) { 
        console.log('Created local peer connection object localPeerConnection.');
        peerConn = new RTCPeerConnection(config); 
        peerConn.addEventListener('icecandidate', this.handleConnection);
        peerConn.addEventListener(
          'iceconnectionstatechange', this.handleConnectionChange);
        streamLocal.peerConn = peerConn
    }, 
    addCandidate:function(iceCandidate){
      const newIceCandidate = new RTCIceCandidate(iceCandidate); 
      streamLocal.peerCon.addIceCandidate(newIceCandidate)
        .then(() => { 
          console.log(`local ICE candidate:\n` +
          `${iceCandidate}.`);
        }).catch(streamChange.logError); 
    },
    closeStream:function(){
      if (!streamLocal.isOffer) {
        return
      }
      streamLocal.isOffer = false
      streamLocal.peerConn.close()
      console.log('closeStream.');
    },
   
    offerStream:function(localStream){
      if (streamLocal.isOffer) {
        return
      }
      streamLocal.isOffer = true
      // Add local stream to connection and create offer to connect.
      streamLocal.peerConn.addStream(localStream);
      console.log('Added local stream to localPeerConnection.');
    
      console.log('localPeerConnection createOffer start.');
      streamLocal.peerConn.createOffer(offerOptions)
        .then(this.createdOffer).catch(streamChange.logError);
    }, 
    createdOffer:function(description) {
      // Logs offer creation and sets peer connection session descriptions. 
      console.log('createdOffer description.');
      console.log(description)
      streamLocal.peerConn.setLocalDescription(description)
        .then(() => {
          console.log(`Offer from localPeerConnection:\n${description.sdp}`);           
          ims.tallMsg(p2ps.to,{
            type: 'description',
            description: streamLocal.peerConn.localDescription
            }, imDefine.P2P); 
        }).catch(streamChange.logError); 
    },
    answerCreate:function(description) { 
      console.log('answerCreate start.');
      streamLocal.peerConn.setRemoteDescription(description)
        .then(() => {
          setRemoteDescriptionSuccess( streamLocal.peerConn);
        }).catch(streamChange.logError); 
    },
    handleConnection:function (event) {
      console.log("handleConnection -local") 
      // Connects with new peer candidate.
      const peerConnection = event.target;
      const iceCandidate = event.candidate; 
      if (iceCandidate) {
        if (!streamChange.isOtherPeer(peerConnection)) { 
            console.log("send to other ice")
            ims.tallMsg(p2ps.to,{
              type: 'candidate', 
              candidate: event.candidate
              }, imDefine.P2P);  
        } 
      }
    },
} 

const offerOptions = {
  offerToReceiveVideo: 1,
};
 
// Logs that the connection succeeded.
function handleConnectionSuccess(peerConnection) {
  console.log(`${getPeerName(peerConnection)} addIceCandidate success.`);
};

// Logs that the connection failed.
function handleConnectionFailure(peerConnection, error) {
  console.log(`${getPeerName(peerConnection)} failed to add ICE Candidate:\n`+
        `${error.toString()}.`);
}

// Gets the "other" peer connection.
function getOtherPeer(peerConnection) {
  return (peerConnection === streamLocal.peerConn) ?
    p2pStream.remotePeerConn : streamLocal.peerConn;
} 
// Gets the name of a certain peer connection.
function getPeerName(peerConnection) {
  return (peerConnection === streamLocal.peerConn) ?
      'localPeerConnection' : 'remotePeerConnection';
}
 
// Logs success when setting session description.
function setDescriptionSuccess(peerConnection, functionName) {
  const peerName = getPeerName(peerConnection);
  console.log(`${peerName} ${functionName} complete.`);
}

// Logs success when localDescription is set.
function setLocalDescriptionSuccess(peerConnection) {
  setDescriptionSuccess(peerConnection, 'setLocalDescription');
}
function setRemoteDescriptionSuccess(peerConnection) {
  setDescriptionSuccess(peerConnection, 'setRemoteDescription');
}


// Logs answer to offer creation and sets peer connection session descriptions.
function createdAnswer(description) {
  console.log(`Answer from remotePeerConnection:\n${description.sdp}.`);

  console.log('remotePeerConnection setLocalDescription start.');
  streamRemote.peerConn.setLocalDescription(description)
    .then(() => {
      setLocalDescriptionSuccess(p2pStream.remotePeerConn);
    }).catch(streamChange.logError);

  console.log('localPeerConnection setRemoteDescription start.');
  streamLocal.peerConn.setRemoteDescription(description)
    .then(() => {
      setRemoteDescriptionSuccess( streamLocal.peerConn);
    }).catch(streamChange.logError);
}
 