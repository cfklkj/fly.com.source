var lSocket = lSocket || {};
var localSocket = lSocket.Method = { 
    wsLocal:null,   
    url:"",
    disconnect:true,
    msg:null,
    hearMsg:function(){
        msg = {"Operation":imDefine.Opt_heart, "Body":{}}
        return JSON.stringify(msg)
    },
    mkReadMsgLenth:function(user){
        var data =  {"Act":imDefine.Act_msgLen, "Sender": user}  
        return JSON.stringify(data)

    },
    mkReadMsg:function(user, index){ 
       var data =  {"Act":imDefine.Act_read, "Sender": user, "Index":index}  
       return JSON.stringify(data)
    }, 
    mkSetMsg:function(user, msg){ 
       msgStr = JSON.stringify(msg)
       var data =  {"Act":imDefine.Act_write, "Sender": user, "Data":msgStr}  
       return JSON.stringify(data)
    }, 
    getLoginInfo: function(userName, password) {  
        body = 'username=' +userName+ "&password=" +password; 
        var data =  {"Act":imDefine.Act_getLogin, "Data":body}   
        wsLocal.send(JSON.stringify(data)); 
    },
    send:function(msg){
        if (msg == null) {
            return
        }
        if (localSocket.disconnect == true) {
            this.msg = msg
            localSocket.connect(localSocket.url)
            return
        }
         //发送文本 
         this.wsLocal.send(msg); 
    },
    connect:function(url){   //"wsLocal://localhost:8080/msg"
        this.url = url
        wsLocal = new WebSocket(url);
        this.wsLocal = wsLocal
        localSocket.disconnect = false
        //readyState属性返回实例对象的当前状态，共有四种。
        //CONNECTING：值为0，表示正在连接。
        //OPEN：值为1，表示连接成功，可以通信了。
        //CLOSING：值为2，表示连接正在关闭。
        //CLOSED：值为3，表示连接已经关闭，或者打开连接失败
        //例如：if (wsLocal.readyState == WebSocket.CONNECTING) { }
        
        //【用于指定连接成功后的回调函数】
        wsLocal.onopen = function (evt) {
            console.log("Connection open ..."); 
            bodysRight.addMsg("\n已连接到服务器 " + url )
            localSocket.send(localSocket.msg)
          //  wsLocal.send(localSocket.hearMsg())
        };
        //wsLocal.addEventListener('open', function (event) {
        //    wsLocal.send('Hello Server!');
        //};
        
        //【用于指定收到服务器数据后的回调函数】
        //【服务器数据有可能是文本，也有可能是二进制数据，需要判断】
        wsLocal.onmessage = function (event) { 
            console.debug(event.data)
            bodysRight.addMsg(event.data)
            if(event.data.length < 3)  //换行
            {
                return
            }  
            var tbase64 = new Base64()
            try{        
                data = tbase64.decode(event.data)
                console.debug(data)
                bodysRight.addMsg(data)
            }catch(err){
                console.debug(event.data)
            }  
            data = JSON.parse(event.data)   
            bodysRight.addMsg(JSON.stringify(data))
        };
        
        //[【于指定连接关闭后的回调函数。】
        wsLocal.onclose = function (evt) {
            console.log("Connection closed.");
            bodysRight.addMsg("\n连接已断开-点击发送按钮重新连接")
            localSocket.disconnect = true
        }; 
        //webSocket.onerror 用于指定报错时的回调函数
        
        wsLocal.onerror = function (event) {
        };
        
        wsLocal.addEventListener("error", function (event) {
        });
    }
}
 