
/****************************************************************************
* WebRTC peer connection and data channel
step:
1.channelStreamRead.create(streamChange.configuration)
2.channelStreamWrite.create(streamChange.configuration)
1.channelStreamWrite.send(stream)
****************************************************************************/ 
var channelStreamWrite = {
  offerOptions: {
    offerToReceiveVideo: 1,
  },
  peerConn:null, 
  pcConstraint:null,
  dataConstraint:null,
  create:function(config){ 
    console.log('createSend.');
    channelStreamWrite.peerConn  = new RTCPeerConnection(config);  
    channelStreamWrite.peerConn.onicecandidate = this.sendIce;
    channelStreamWrite.peerConn.onaddstream = this.sendStream;
    channelStreamWrite.peerConn.onremovestream = this.closeStream; 
  }, 
  closeStream:function(){
    console.log("moved")
  },
  sendStream:function(stream){
    ims.tallMsg(p2ps.to,{
      head:'stream',
      type: 'stream', 
      for:"read",
      stream: stream
      }, imDefine.P2P);   
  },
  channelDsp:function (desc) {
    console.log('Offer from localConnection ' + desc.sdp);
    channelStreamWrite.peerConn.setLocalDescription(desc);
    ims.tallMsg(p2ps.to,{
      head:'stream',
      type: 'channelDsp', 
      for:"read",
      desc: desc
      }, imDefine.P2P);    
  },
  answerDsp:function(desc){
    console.log("write answerDsp", desc)
    channelStreamWrite.peerConn.setRemoteDescription(desc);
  },
  channelState:function(){
    console.log("statu", channelStreamWrite.readyState)
  },
  sendIce:function (event) {
    console.log('local  sendIce');
    if (event.candidate) {
      ims.tallMsg(p2ps.to,{
        head:'stream',
        type: 'candidate', 
        for:'read',
        candidate: event.candidate
        }, imDefine.P2P);   
    }
  },
  answerIce:function(candidate){
    console.log("answerIce")
    channelStreamWrite.peerConn.addIceCandidate(
      candidate
    ).then(
      this.onAddIceCandidateSuccess,
      streamChange.logError
    ); 
  },
  onAddIceCandidateSuccess:function(){
    console.log('AddIceCandidate success.');
  },
  send:function(stream){
    console.log( "channelStreamWrite.peerConn") 
    channelStreamWrite.peerConn.addStream(stream) //先加stream 后offer
    channelStreamWrite.peerConn.createOffer(channelStreamWrite.offerOptions).then(
      this.channelDsp,
      streamChange.logError
    );
  },
  tallMsg:function(msg){
    switch(msg.for){
        case 'write':
          break
        default:
          return false
    }
    switch(msg.head){
        case 'stream':
          break
        default:
          return false
    }
    switch(msg.type){
      case 'candidate': 
        this.answerIce(msg.candidate)
        break;
      case 'answerDsp':
        this.answerDsp(msg.desc)
        break;
    }
    return true
  }
}

var channelStreamRead = {
  peerConn:null,
  create:function(config){ 
    channelStreamRead.peerConn  = new RTCPeerConnection(config); 
    console.log('dataChannel.');
    channelStreamRead.peerConn.onicecandidate = this.sendIce; 
    channelStreamRead.peerConn.onaddstream = this.gotRemoteMediaStream; 
  },
  gotRemoteMediaStream:function(event){
    console.log('gotRemoteMediaStream.');
    console.log(event)
    console.log(event.stream)
    takePhotos.showRemote(event.stream)
  },
  channelState:function(){
    console.log("statu", channelStreamRead.readyState)
  },
  answerStream:function(stream){
    console.log('Remote stream added.');
    console.log(stream)
  },
  sendIce:function (event) {
    console.log('channelStreamRead sendIce');
    if (event.candidate) {
      ims.tallMsg(p2ps.to,{
        head:'stream',
        type: 'candidate', 
        for:'write',
        candidate: event.candidate
        }, imDefine.P2P);   
    }
  },
  answerIce:function(candidate){
    console.log("answerIce")
    channelStreamRead.peerConn.addIceCandidate(
      candidate
    ).then(
      this.onAddIceCandidateSuccess,
      streamChange.logError
    ); 
  },
  onAddIceCandidateSuccess:function(){
    console.log('read AddIceCandidate success.');
  },
  channelDsp:function (desc) { 
    console.log("channelDsp")
    console.log(desc)
    channelStreamRead.peerConn.setRemoteDescription(desc);
    channelStreamRead.peerConn.createAnswer().then(
      this.answerDsp,
      streamChange.logError
    );
  },
  answerDsp:function(desc){
    console.log("answerDsp", desc)
    channelStreamRead.peerConn.setLocalDescription(desc);
    ims.tallMsg(p2ps.to,{
      head:'stream',
      type: 'answerDsp', 
      for:"write",
      desc: desc
      }, imDefine.P2P);    
  }, 
  tallMsg:function(msg){
    switch(msg.for){
        case 'read':
          break
        default:
          return false
    }
    switch(msg.head){
        case 'stream':
          break
        default:
          return false
    }
    switch(msg.type){
      case 'candidate': 
        this.answerIce(msg.candidate)
        break;
      case 'channelDsp':
        this.channelDsp(msg.desc)
        break;
      case 'stream':
        this.answerStream(msg.stream)
        break;
    }
    return true
  }
}
