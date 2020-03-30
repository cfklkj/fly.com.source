var lSocket = lSocket || {};
var localSocket = lSocket.Method = { 
    wsLocal:null, 
    loginUser:"",  
    url:"",
    lastMsg:"",
    setLoginUser:function(user){
        return this.loginUser = user
    },
    isLoginUser:function(user){
        return this.loginUser == user
    }, 
    tallMsg:function(to, data, dataType){
        console.log("ddd",this.loginUser)
        from = this.loginUser
        dataMsg = {"type":dataType, "content":data}
        var data =  {"from":from, "to": to, "Data":util.zip(JSON.stringify(dataMsg))}  
        wsLocal.send(JSON.stringify(data)); 
        doHttp.logAdd(JSON.stringify(data))
        return dataMsg
    }, 
    getLoginInfo: function(userName, password) {  
      //  body = 'username=' +userName+ "&password=" +password; 
      data = {"login":userName, "passwd":password}   
      wsLocal.send(JSON.stringify(data)); 
    },
    send:function(msg){
         //发送文本  
         wsLocal.send(msg); 
    },
    connect:function(url, username, password){   //"wsLocal://localhost:8080/msg" 
        wsLocal = new WebSocket(url);
        //readyState属性返回实例对象的当前状态，共有四种。
        //CONNECTING：值为0，表示正在连接。
        //OPEN：值为1，表示连接成功，可以通信了。
        //CLOSING：值为2，表示连接正在关闭。
        //CLOSED：值为3，表示连接已经关闭，或者打开连接失败
        //例如：if (wsLocal.readyState == WebSocket.CONNECTING) { }
        
        //【用于指定连接成功后的回调函数】
        wsLocal.onopen = function (evt) {
            console.log("Connection open ...");  
            localSocket.getLoginInfo(username, password)  
        };
        //wsLocal.addEventListener('open', function (event) {
        //    wsLocal.send('Hello Server!');
        //};
        
        //【用于指定收到服务器数据后的回调函数】
        //【服务器数据有可能是文本，也有可能是二进制数据，需要判断】
        wsLocal.onmessage = function (event) { 
            // if (localSocket.lastMsg == "err-logined") {
            //     alert(localSocket.lastMsg)
            // }
            if(event.data.length < 15)  //换行
            {
                return
            }   
            data = JSON.parse(event.data)   
            if (data.online != null) {
                if (data.online == username ) { 
                    outDiv.resLogins(data.online)
                }else{ 
                    chatLeft.addContentTag(data.online, "") 
                }
            } 
            if (data.Data != null ){ 
                inDiv.routeInfo(data.from, JSON.parse(util.unzip(data.Data))) 
            } 
        };
        
        //[【于指定连接关闭后的回调函数。】
        wsLocal.onclose = function (evt) {
            console.log("Connection closed."); 
        }; 
        //webSocket.onerror 用于指定报错时的回调函数
        
        wsLocal.onerror = function (event) {
        };
        
        wsLocal.addEventListener("error", function (event) {
        });
    }
}
 