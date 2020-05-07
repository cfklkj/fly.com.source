
/****************************************************************************
* WebRTC peer connection and data channel
setp:
1.channelDataRead.create(streamChange.configuration)
2.channelDataWrite.create(streamChange.configuration)
3.channelDataWrite.send("hello")
****************************************************************************/ 
var channelDataWrite = {
  peerConn:null,
  channel:null,
  pcConstraint:null,
  dataConstraint:null,
  create:function(config){ 
    console.log('createSend.');
    channelDataWrite.peerConn  = new RTCPeerConnection(config, channelDataWrite.pcConstraint); 
    console.log("channelDataWrite.pcConstraint", channelDataWrite.pcConstraint)
    channelDataWrite.channel = channelDataWrite.peerConn.createDataChannel('sendDataChannel',
    channelDataWrite.dataConstraint);  
    channelDataWrite.peerConn.onicecandidate = this.sendIce;
    channelDataWrite.channel.onopen = this.channelState;
    channelDataWrite.channel.onclose = this.channelState; 
    channelDataWrite.peerConn.createOffer().then(
      this.channelDsp,
      streamChange.logError
    );
  }, 
  channelDsp:function (desc) {
    console.log('Offer from localConnection ' + desc.sdp);
    channelDataWrite.peerConn.setLocalDescription(desc);
    ims.tallMsg(p2ps.to,{
      head:'data',
      type: 'channelDsp', 
      for:"read",
      desc: desc
      }, imDefine.P2P);    
  },
  answerDsp:function(desc){
    console.log("write answerDsp", desc)
    channelDataWrite.peerConn.setRemoteDescription(desc);
  },
  channelState:function(){
    console.log("statu", channelDataWrite.readyState)
  },
  sendIce:function (event) {
    console.log('local  sendIce');
    if (event.candidate) {
      ims.tallMsg(p2ps.to,{
        head:'data',
        type: 'candidate', 
        for:'read',
        candidate: event.candidate
        }, imDefine.P2P);   
    }
  },
  answerIce:function(candidate){
    console.log("answerIce")
    channelDataWrite.peerConn.addIceCandidate(
      candidate
    ).then(
      this.onAddIceCandidateSuccess,
      streamChange.logError
    ); 
  },
  onAddIceCandidateSuccess:function(){
    console.log('AddIceCandidate success.');
  },
  send:function(msg){
    channelDataWrite.channel.send(msg)
  },
  tallMsg:function(msg){
    switch(msg.for){
        case 'write':
          break
        default:
          return false
    }
    switch(msg.head){
        case 'data':
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

var channelDataRead = {
  peerConn:null,
  create:function(config){ 
    channelDataRead.peerConn  = new RTCPeerConnection(config); 
    console.log('dataChannel.');
    channelDataRead.peerConn.onicecandidate = this.sendIce;
    channelDataRead.peerConn.ondatachannel =  this.channelCallback;
  },
  channelState:function(){
    console.log("statu", channelDataRead.readyState)
  },
  sendIce:function (event) {
    console.log('channelDataRead sendIce');
    if (event.candidate) {
      ims.tallMsg(p2ps.to,{
        head:'data',
        type: 'candidate', 
        for:'write',
        candidate: event.candidate
        }, imDefine.P2P);   
    }
  },
  answerIce:function(candidate){
    console.log("answerIce")
    channelDataRead.peerConn.addIceCandidate(
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
    console.log("channelDsp", desc)
    channelDataRead.peerConn.setRemoteDescription(desc);
    channelDataRead.peerConn.createAnswer().then(
      this.answerDsp,
      streamChange.logError
    );
  },
  answerDsp:function(desc){
    console.log("answerDsp", desc)
    channelDataRead.peerConn.setLocalDescription(desc);
    ims.tallMsg(p2ps.to,{
      head:'data',
      type: 'answerDsp', 
      for:"write",
      desc: desc
      }, imDefine.P2P);    
  },
  channelCallback:function(event){ 
    channelDataRead.channel = event.channel
    channelDataRead.channel.onmessage = channelDataRead.channelMsg;
    channelDataRead.channel.onopen = this.channelState;
    channelDataRead.channel.onclose = this.channelState;
  },
  channelMsg:function(event){
    console.log('Received Message:' + event.data); 
  },
  tallMsg:function(msg){
    switch(msg.for){
        case 'read':
          break
        default:
          return false
    }
    switch(msg.head){
        case 'data':
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
    }
    return true
  }
}
