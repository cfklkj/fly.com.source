var lSocket = lSocket || {};
var localSocket = lSocket.Method = { 
    wsLocal:null, 
    loginUser:"",  
    url:"",
    isLoginUser:function(user){
        return this.loginUser == user
    },
    hearMsg:function(){
        msg = {"Operation":defines.Opt_heart, "Body":{}}
        return JSON.stringify(msg)
    },
    ReadMsgLenth:function(name){
        var data =  {"Act":defines.Act_msgLen, "ConversationId": name}  
        wsLocal.send(JSON.stringify(data));  
    },
    ReadMsg:function(name, index){ 
       var data =  {"Act":defines.Act_read, "ConversationId": name, "Index":index}  
       wsLocal.send(JSON.stringify(data));  
    }, 
    SetMsg:function(name, msg){ 
       msgStr = util.zip(msg)
       var data =  {"Act":defines.Act_write, "ConversationId": name, "Data":msgStr}   
       wsLocal.send(JSON.stringify(data)); 
    }, 
    pubMsg:function(msg){ 
        var data =  {"Act":defines.Act_pub,  "Data":msg}  
        wsLocal.send(JSON.stringify(data)); 
    },
    pubLoginMsg:function(user){
        this.loginUser = user
        var data =  {"Act":defines.Act_Login, "ConversationId": user}  
        this.pubMsg(data)
    },
    onlineMsg:function(to){
        dataMsg = {"type":defines.Act_Login, "content":this.loginUser}
        var data =  {"Act":defines.Act_route, "ConversationId": to, "Data":dataMsg}  
        wsLocal.send(JSON.stringify(data)); 
        return dataMsg 
    },
    tallMsg:function(to, data, dataType){
        dataMsg = {"type":dataType, "content":data}
        var data =  {"Act":defines.Act_route, "ConversationId": to, "Data":dataMsg}  
        wsLocal.send(JSON.stringify(data)); 
        return dataMsg
    }, 
    getLoginInfo: function(userName, password) {  
      //  body = 'username=' +userName+ "&password=" +password; 
        body = {"Username":userName, "Password":password}
        var data =  {"Act":defines.Act_Login, "ConversationId": userName, "Data":JSON.stringify(body)}   
        wsLocal.send(JSON.stringify(data)); 
    },
    setRunInfo:function(act, oldName, name, path){ 
        body = {"Act":act, "OldName":oldName, "Name":name, "Path":path}
        var data =  {"Act":defines.Act_setRunInfo, "Data":body}   
        wsLocal.send(JSON.stringify(data)); 
    },
    getRunInfo:function(act, name){
        body = {"Act":act, "Name":name}
        var data =  {"Act":defines.Act_getRunInfo, "Data":body}   
        wsLocal.send(JSON.stringify(data)); 
    }, 
    doRun:function(act, name){
        body = {"Act":act, "Name":name}
        var data =  {"Act":defines.Act_run, "Data":body}   
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
            if(event.data.length < 15)  //换行
            {
                return
            }   
            data = JSON.parse(event.data)   
            if (data.Code == defines.Act_read){
                if (data.Data.Data == ""){
                    return
                }  
                body = data.Data 
                bodysRight.statu_rightAdd(body.ConversationId, util.unzip(body.Data), true)
            } 
            if (data.Code == defines.Act_print){
                data = data.Data  
                if(bodys.mem.get(defines.act_leftSelect).innerText == "状态信息"){
                     bodysRight.statu_rightAdd(data.ConversationId, data.Data)
                }
                localSocket.SetMsg(data.ConversationId, data.Data)
            }
            if (data.Code == defines.Act_msgLen){
                logLength = data.Data.Index 
                bodys.mem.add(defines.act_selectContentLogLenth, logLength); 
                bodysRightAct.chat_logFirst = true;
                bodysRightAct.upLog(); 
            }
            if (data.Code == defines.Act_Login){ 
               // var tbase64 = new Base64()
                //outDiv.resLogins(tbase64.decode(data.Data.Data))
            }
            if (data.Code == defines.Act_pub) { 
                inDiv.pubInfo(data.Data) 
            }
            if (data.Code == defines.Act_route){
                inDiv.routeInfo(data.Data)
            }
            if (data.Code == defines.Act_setRunInfo){ 
                body = data.Data.Data 
               switch(body.Act){
                   case defines.Act_alt:
                       if (body.Data == true) { 
                            bodysRight.alterDetail(body.Name)
                        }
                        break
                    case defines.Act_add:
                        bodysRight.addSet_bottom_ele(body.Data)
                    break
                    case defines.Act_del:
                        if (body.Data == true) { 
                             bodysRight.delTag()
                        }
                        break
               }
            }
            if (data.Code == defines.Act_getRunInfo){ 
                if(data.Data.Data.Act == defines.Act_all){
                    body = data.Data.Data.Data
                    for (i=0, len = body.length; i < len; i ++){ 
                        if(bodys.mem.get(defines.act_leftSelect).innerText == "状态信息"){
                            bodysRight.statu_leftAdd(body[i].Name, body[i].IsRun)
                        }else{
                            bodysRight.addSet_bottom_ele(body[i].Name, body[i].IsRun)
                        }
                    }                    
                }else{
                    body = data.Data.Data.Data 
                    bodysRightDlg.showInfo(body.Name, body.Path)
                }
            }
            if (data.Code == defines.Act_run){
                body = data.Data.Data
               switch(body.Act){
                   case defines.Act_run_statu: 
                        bodysRight.alterStatu(body.Data)  
                   break
                   default:
                       if (body.Data){
                         window.setTimeout("localSocket.doRun(defines.Act_run_statu, '" + body.Name + "')", 100)   
                       }
               }
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
 