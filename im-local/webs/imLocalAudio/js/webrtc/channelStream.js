
/****************************************************************************
* WebRTC peer connection and data channel
step:
1.channelStreamRead.create(turnConfiguration)
2.channelStreamWrite.create(turnConfiguration)
3.channelStreamWrite.send(stream) 
4.注意：如果远程要看本地流，需要  channelStreamWrite.setOpenMedia
****************************************************************************/ 
var channelStream = {
  recv:function(from, msg){
    if (channelStreamWrite.tallMsg(from, msg))
      return
    if (channelStreamRead.tallMsg(from, msg))
      return
  }
}
var channelStreamWrite = {
  peerConn:null, 
  pcConstraint:null,
  dataConstraint:null,
  openMedia:null,
  create:function(config){ 
    console.log('creatWrite.');
    channelStreamWrite.peerConn  = new RTCPeerConnection(config);  
    channelStreamWrite.peerConn.onicecandidate = this.sendIce; 
    channelStreamWrite.peerConn.onaddstream = this.sendStream; 
    channelStreamWrite.peerConn.onremovestream = this.closeStream;  
  }, 
  setOpenMedia:function(){
    channelStreamWrite.openMedia = medias.openMedia
  },
  closeStream:function(){
    console.log("moved")
  },
  sendStream:function(stream){
    channelChange.send({
      head:'stream',
      type: 'stream', 
      for:"read",
      stream: stream
      });   
  },
  channelDsp:function (desc) {
    console.log('Offer from localConnection ' + desc.sdp);
    channelStreamWrite.peerConn.setLocalDescription(desc);
    channelChange.send({
      head:'stream',
      type: 'channelDsp', 
      for:"read",
      desc: desc
      });    
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
      channelChange.send({
        head:'stream',
        type: 'candidate', 
        for:'read',
        candidate: event.candidate
        });     
    }
  },
  answerIce:function(candidate){
    console.log("answerIce")
    channelStreamWrite.peerConn.addIceCandidate(
      candidate
    ).then(
      this.onAddIceCandidateSuccess,
      channelChange.logError
    ); 
  },
  onAddIceCandidateSuccess:function(){
    console.log('AddIceCandidate success.');
  },
  send:function(stream, video, audio){
    offerOptions={
      offerToReceiveVideo: video,
      offerToReceiveAudio: audio,
    }
    console.log( "channelStreamWrite.peerConn") 
    channelStreamWrite.peerConn.addStream(stream) //先加stream 后offer
    channelStreamWrite.peerConn.createOffer(offerOptions).then(
      this.channelDsp,
      channelChange.logError
    );
  },
  tallMsg:function(from, msg){
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
      case 'reqTalk':
        alert("user req talk：" + from)
        channelChange.answerTalk(from)
        if (channelStreamWrite.openMedia) {
          channelStreamWrite.openMedia()
        }
        break;
    }
    return true
  }
}

var channelStreamRead = {
  peerConn:null,
  create:function(config){ 
    console.log('createRead.');
    channelStreamRead.peerConn  = new RTCPeerConnection(config);  
    channelStreamRead.peerConn.onicecandidate = this.sendIce; 
    channelStreamRead.peerConn.onaddstream = this.gotRemoteMediaStream; 
  },
  gotRemoteMediaStream:function(event){
    console.log('gotRemoteMediaStream.');
    console.log(event)
    console.log(event.stream)
    medias.onreadCallback(event.stream)
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
      channelChange.send({
        head:'stream',
        type: 'candidate', 
        for:'write',
        candidate: event.candidate
        });      
    }
  },
  answerIce:function(candidate){
    console.log("answerIce")
    channelStreamRead.peerConn.addIceCandidate(
      candidate
    ).then(
      this.onAddIceCandidateSuccess,
      channelChange.logError
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
      channelChange.logError
    );
  },
  answerDsp:function(desc){
    console.log("answerDsp", desc)
    channelStreamRead.peerConn.setLocalDescription(desc);
    channelChange.send({
      head:'stream',
      type: 'answerDsp', 
      for:"write",
      desc: desc
      });      
  }, 
  tallMsg:function(from, msg){
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
      case 'reqTalk': 
           channelChange.setSendToUser(from)
           medias.openMedia() 
          break;
    }
    return true
  }
}
