/*
im
0.ims.onp2pRecv=function(from, msg){}
0.ims.onlogin=function(){}
1.ims.connect(url, user, pass)
*/
var ims = { 
    wsLocal:null,   
    onp2pRecv:null,
    onlogin:null,
    from:function(){
        return memHash.get(imDefine.login_user)
    },
    tallMsg:function(to, data, dataType){ 
        from = this.from()
        dataMsg = {"type":dataType, "content":data}
        var data =  {"from":from, "to": to, "Data":util.zip(JSON.stringify(dataMsg))}  
        this.wsLocal.send(JSON.stringify(data));  
        return dataMsg
    },  
    byteMsg:function(to, data, dataType){ 
        var from =  this.from()
        var dataMsg = {"type":dataType, "content":data} 
        var data =  {"from":from, "to": to, "Data":util.zip(dataMsg)}   
        this.wsLocal.send(JSON.stringify(data));  
        return dataMsg
    },  
    login: function(userName, password) {  
      //  body = 'username=' +userName+ "&password=" +password; 
      data = {"login":userName, "passwd":password}   
      this.wsLocal.send(JSON.stringify(data)); 
    },
    send:function(msg){
         //发送文本  
         this.wsLocal.send(msg);  
    },
    close:function(){
        this.wsLocal.close()
    },
    connect:function(url, username, password){   //"wsLocal://localhost:8080/msg" 
        memHash.add(imDefine.login_user, username)   
    wsLocal = new WebSocket(url);
        this.wsLocal  = wsLocal
        //readyState属性返回实例对象的当前状态，共有四种。
        //CONNECTING：值为0，表示正在连接。
        //OPEN：值为1，表示连接成功，可以通信了。
        //CLOSING：值为2，表示连接正在关闭。
        //CLOSED：值为3，表示连接已经关闭，或者打开连接失败
        //例如：if (wsLocal.readyState == WebSocket.CONNECTING) { }
        
        //【用于指定连接成功后的回调函数】 
        wsLocal.onopen = function (evt) {
            console.log("Connection open ...");  
            ims.login(username, password)  
        };
        //wsLocal.addEventListener('open', function (event) {
        //    wsLocal.send('Hello Server!');
        //};
        
        //【用于指定收到服务器数据后的回调函数】
        //【服务器数据有可能是文本，也有可能是二进制数据，需要判断】
        wsLocal.onmessage = function (event) { 
            //console.log(event.data)
            // if (ims.lastMsg == "err-logined") {
            //     alert(ims.lastMsg)
            // }
            if(event.data.length < 15)  //换行
            {
                return
            }   
            try{ 
                data = JSON.parse(event.data)   
                console.log(data)
                if (data.offline != null) { 
                // msgRoute.offline(data.offline)
                }
                if (data.online != null) {  
                    if (data.online == ims.from()){
                        ims.onlogin() 
                    }                 
                    return   
                } 
                console.log("222", data)
                if (data.Data != null ){   
                    body = JSON.parse(util.unzip(data.Data))
                    if (body.type == imDefine.P2P)
                    {
                        ims.onp2pRecv(data.from, body.content)
                        return
                    }  
                } 
            }catch(e){    
                console.log("onmessage:",e, util.unzip(data.Data));  
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
 