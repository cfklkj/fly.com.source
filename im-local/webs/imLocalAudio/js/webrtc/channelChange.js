/*
step:
1.channelChange.createChannel()
2.channelChange.reqAudioTalk(user)
*/ 
var channelChange = {
    sendTo:"", 
    recv:channelStream.recv, 
    turnConfiguration:{
        "iceServers": [
            { 
              urls: 'turn:im.guiruntang.club',  /*edge*/
              url: 'turn:im.guiruntang.club', /*fireword*/
              username: 'flys',
              credential: '123456'
            } 
        ] 
      },
    logError:function (err) {
        if (!err) return;
        if (typeof err === 'string') {
        console.warn(err);
        } else {
        console.warn(err.toString(), err);
        }
    },
    createChannel:function(){ 
      channelStreamRead.create(this.turnConfiguration)
      channelStreamWrite.create(this.turnConfiguration)
    },
    reqAudioTalk:function (user) {
        this.setSendToUser(user)
        this.send({
          head:'stream',
          type: 'reqTalk', 
          for:'write'
          });   
     },
     answerTalk:function(user){
      this.setSendToUser(user)
      this.send({
        head:'stream',
        type: 'reqTalk', 
        for:'read'
        });  
     },
     setSendToUser:function (user) {
      channelChange.sendTo = user   
     },
     send:function(data){
        ims.tallMsg(channelChange.sendTo,data, imDefine.P2P);   
     },
}