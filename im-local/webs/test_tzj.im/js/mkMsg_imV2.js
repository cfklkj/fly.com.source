var mkMsgV2 = mkMsgV2 || {};
var mkMsgs_imV2 = mkMsgV2.Method = { 
     heart:function(){ 
       bodysMiddel.showSend() 
       var data =  {"opt":110, "说明": "心跳无返回--校验自身是否发送成功即可\n未登入的用户需在5s内发送登入消息\n登入的用户需要在5分钟内发送心跳消息"}  
       return JSON.stringify(data) 
     },
     readyLogin:function(){ 
       bodysMiddel.showPost()
       body ={"userid":"test3@test.com"}
       var data =  {"url":"/im/login", "data": JSON.stringify(body)}  
       return JSON.stringify(data) 
     },
     readyLoginWs:function(){ 
          bodysMiddel.showPost()
       body ={"userid":"test3@test.com"}
       var data =  {"url":"/im/loginWs", "data": JSON.stringify(body)}  
       return JSON.stringify(data) 
     },
   msgLogin:function(username, password){ 
     bodysMiddel.showSend()
        sign = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJ0ZXN0M0B0ZXN0LmNvbSJ9.5INHWMFBMXIaRM_lv9R0taAYNANsU2vfFLI6Q459NQ8"
           body = {"sign":sign}
        var data =  {"opt":110001, "data": body}  
        return JSON.stringify(data) 
   }, 
     bigMucCreate:function(){
          bodysMiddel.showPost()
          body ={"group":"test@test.com.L.muc"}
          var data =  {"url":"/im/bigMucCreate", "data": JSON.stringify(body)} 
          return JSON.stringify(data) 
     },
     bigMucDel:function(){
          bodysMiddel.showPost()
          body ={"group":"test@test.com.L.muc"}
          var data =  {"url":"/im/bigMucDel", "data": JSON.stringify(body)} 
          return JSON.stringify(data) 
     },
     bigMucJoin:function(){
          bodysMiddel.showSend()
          body ={"group":"test@test.com.L.muc"}
          var data =  {"opt":130003, "data": body} 
          return JSON.stringify(data) 
     }, 
     bigMucLeave:function(){
          bodysMiddel.showSend()
          body ={"group":"test@test.com.L.muc"}
          var data =  {"opt":130004, "data": body} 
          return JSON.stringify(data) 
     },  
     bigMucMsg:function(){
          bodysMiddel.showSend()
          body ={"from":"", "group":"test@test.com.L.muc", "data":"hello"} 
          var data =  {"opt":130005, "data": body} 
          return JSON.stringify(data) 
     },  

     mucCreate:function(){
          bodysMiddel.showPost()
          body ={"group":"test@test.com.muc"}
          var data =  {"url":"/im/mucCreate", "data": JSON.stringify(body)} 
          return JSON.stringify(data) 
     },
     mucDel:function(){
          bodysMiddel.showPost()
          body ={"group":"test@test.com.muc"}
          var data =  {"url":"/im/mucDel", "data": JSON.stringify(body), "说明":"群成员会收到群删除信息"} 
          return JSON.stringify(data) 
     }, 
     mucJoin:function(){
          bodysMiddel.showPost()
          body ={"userid": "test3@test.com","group":"test@test.com.muc"}
          var data =  {"url":"/im/mucJoin", "data": JSON.stringify(body), "说明":"群成员会收到成员加群信息"} 
          return JSON.stringify(data) 
     }, 
     mucLeave:function(){
          bodysMiddel.showPost()
          body ={"userid": "test3@test.com","group":"test@test.com.muc"}
          var data =  {"url":"/im/mucLeave", "data": JSON.stringify(body), "说明":"群成员会收到成员退群除信息"} 
          return JSON.stringify(data) 
     },   
     mucMsg:function(){
          bodysMiddel.showSend()
          body ={"from":"", "group":"test@test.com.muc", "data":"he2llo"} 
          var data =  {"opt":120005, "data": body} 
          return JSON.stringify(data) 
     },  
     singleMsg:function(){
          bodysMiddel.showSend()
          body ={"from":"", "to":"test3@test.com", "data":"he2llo"} 
          var data =  {"opt":110003, "data": body} 
          return JSON.stringify(data) 
     },  
     topicMsg:function(){ 
          bodysMiddel.showSend()
          var data =  {"opt":110004} 
          return JSON.stringify(data) 
     },  
     singleMsgDetail:function(){
          bodysMiddel.showSend()
          body ={  "from":"test3@test.com", "index":1} 
          var data =  {"opt":110005, "data": body} 
          return JSON.stringify(data) 
     },  
     mucMsgDetail:function(){
          bodysMiddel.showSend()
          body ={ "group":"test@test.com.muc", "index":1} 
          var data =  {"opt":120006, "data": body} 
          return JSON.stringify(data) 
     },  

}