var mkMsg = mkMsg || {};
var mkMsgs_rasp = mkMsg.Method = { 
     ssh:99,
     shutdown:100,
     playMusic:101,
     heart:function(){ 
       bodysMiddel.showSend() 
       var data =  {"opt":110, "说明": "心跳无返回--校验自身是否发送成功即可\n未登入的用户需在5s内发送登入消息\n登入的用户需要在5分钟内发送心跳消息"}  
       return JSON.stringify(data) 
     },   

     Shutdown:function(){
          bodysMiddel.showSend() 
          var data =  {"opt":this.shutdown} 
          return JSON.stringify(data) 
     },  
     PlayMusic:function(){ 
          bodysMiddel.showSend()
          var data =  {"opt":this.playMusic, "data":"http://ok.renzuida.com/2001/JYZ下-42.mp4"} 
          return JSON.stringify(data) 
     },  
     Ssh:function(){ 
          bodysMiddel.showSend()
          var data =  {"opt":this.ssh, "data":"/usr/bin/omxplayer -o local http://ok.renzuida.com/2001/JYZ下-42.mp4"} 
          return JSON.stringify(data) 
     }  
}