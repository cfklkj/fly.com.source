 

var streamChange = streamChange || {
    configuration: {
          "iceServers": [
              { 
                url: 'turn:im.guiruntang.club', 
                username: 'flys',
                credential: '123456'
              } 
          ] 
    },
    createPeerConnections:function(){
   //   streamLocal.createPeerConnection(this.configuration)
    //  streamRemote.createPeerConnection(this.configuration) 
      streamRemote.dataChannel(this.configuration)
      streamLocal.dataChannel(this.configuration)
    },
    isOtherPeer:function(peerConnection) {
      return (peerConnection === streamLocal.peerConn) ?
        false : true;
    }, 
    logError:function (err) {
        if (!err) return;
        if (typeof err === 'string') {
        console.warn(err);
        } else {
        console.warn(err.toString(), err);
        }
    },
    signalingMessageCallback:function (message) {
      console.log(message)
      if (channelDataRead.tallMsg(message)) {
        return
      }
      if (channelDataWrite.tallMsg(message)) {
        return
      }
      if (channelStreamRead.tallMsg(message)) {
        return
      }
      if (channelStreamWrite.tallMsg(message)) {
        return
      }
      return
      if (message.type === 'offer') {
        console.log('Got offer. Sending answer to peer.');
        peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {},
                                      this.logError);
        peerConn.createAnswer(this.onLocalSessionCreated, this.logError);
    
      } else if (message.type === 'answer') {
        console.log('Got answer.');
        peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {},
        this.logError);
    
      } else if (message.type === 'candidate') { 
        if (message.isAnswer) {
          streamLocal.addCandidate(p2pStream.remotePeerConn, iceCandidate)
        }else{
          streamRemote.addCandidate(message.candidate)
        }
      }else if (message.type === 'description'){ 
        streamRemote.createReceive(message.description)
      }else if (message.type === 'descriptionAnswer'){ 
        streamLocal.answerCreate(message.description)
      }else if (message.type === 'candidateData') { 
        if (message.for === "local") {
          streamLocal.addCandidate(p2pStream.remotePeerConn, iceCandidate)
        }else{
          streamRemote.addCandidate(message.candidate)
        }
      }
    }, 
    channelData:function(){

    }
} 