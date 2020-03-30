var mkMsg = mkMsg || {};
var mkMsgs = mkMsg.Method = { 
   msgLogin:function(username, password){ 
        body = {"sign":username}
        var data =  {"opt":defines.Msg_login, "data": body}  
        return JSON.stringify(data) 
   },
   msgUserlist:function(){
        var data =  {"act":defines.Msg_userListGet}  
        return JSON.stringify(data) 
   },
   userAliasSet:function(userid, alias){
        body = {"id":userid, "alias":alias}
        var data =  {"act":defines.Msg_userAliasSet, "data":body}  
        return JSON.stringify(data) 
   },
   userAliasDel:function(userid){
        body = {"id":userid}
        var data =  {"act":defines.Msg_userAliasDel, "data":body}   
        return JSON.stringify(data) 
   },
   msgSend:function(userid, dataType, data){
        msg = '{\"type\":\"' + dataType + "\", \"content\":\"" + data + "\"}"
        body ={"id":userid, "msg":JSON.stringify(msg)}
        var datas =  {"act":defines.Msg_msgSend, "data":body}   
        return JSON.stringify(datas)  
   },
   callBackMsgGet:function(){ 
        var datas =  {"act":defines.Msg_callBackMsgGet}   
        return JSON.stringify(datas)  
   },
   callBackMsgSet:function(group, data){
        msg = '{\"type\":\"chat\", \"content\":\"' + data + '\"}'
        body ={"group":group, "msg":JSON.stringify(msg)}
        var datas =  {"act":defines.Msg_callBackMsgSet, "data":body}   
        return JSON.stringify(datas)  
   },
   callBackMsgDel:function(group, data){
    msg = '{\"type\":\"chat\", \"content\":\"' + data + '\"}'
        body ={"group":group, "msg":JSON.stringify(msg)}
        var datas =  {"act":defines.Msg_callBackMsgDel, "data":body}   
        return JSON.stringify(datas)  
   },
   msgLength:function(userid){
        body ={"id":userid}
        var datas =  {"act":defines.Msg_msgLength, "data":body}   
        return JSON.stringify(datas)   
   },
   msgDetail:function(userid, index){
        body ={"id":userid, "index":index}
        var datas =  {"act":defines.Msg_msgDetail, "data":body}   
        return JSON.stringify(datas)   
   },
   set:function(k, v){
    body ={"key":k, "value":v}
        var datas =  {"act":defines.Msg_set, "data":body}   
        return JSON.stringify(datas)   
   },
   get:function(k){
        body ={"key":k}
        var datas =  {"act":defines.Msg_get, "data":body}   
        return JSON.stringify(datas)   
   },
   //group
   grouplist:function(){ 
     var datas =  {"act":defines.Msg_grouplist}   
     return JSON.stringify(datas) 

   },
   groupAdd:function(type, groupname, password){
     body ={"type":type, "gname":groupname, "pwd": password}
     var datas =  {"act":defines.Msg_groupAdd, "data":body}   
     return JSON.stringify(datas)  
   },
   groupDel:function(type, groupid){
     body ={"type":type, "id":groupid}
     var datas =  {"act":defines.Msg_groupDel, "data":body}   
     return JSON.stringify(datas)  
   },
   groupJoin:function(type, groupid, password){
     body ={"type":type, "id":groupid, "pwd": password}
     var datas =  {"act":defines.Msg_groupJoin, "data":body}   
     return JSON.stringify(datas)  
   },
   groupLeave:function(type, groupid){
     body ={"type":type, "id":groupid}
     var datas =  {"act":defines.Msg_groupLeave, "data":body}   
     return JSON.stringify(datas)  
   },
   groupMsgLength:function(type, groupid){
        body ={"type":type,"id":groupid}
        var datas =  {"act":defines.Msg_groupMsgLength, "data":body}   
        return JSON.stringify(datas)   
   },
   groupMsgDetail:function(type, groupid, index){
        body ={"type":type,"id":groupid, "index":index}
        var datas =  {"act":defines.Msg_groupMsgDetail, "data":body}   
        return JSON.stringify(datas)   
   },
   groupSetAlias:function(type, groupid, name){
        body ={"type":type,"id":groupid, "alias": name}
        var datas =  {"act":defines.Msg_groupSetAlias, "data":body}   
        return JSON.stringify(datas)   
   },
   groupSetMemberAlias:function(type, groupid, userid, name){
        body ={"type":type,"id":groupid, "userid":userid, "alias": name}
        var datas =  {"act":defines.Msg_groupSetAlias, "data":body}   
        return JSON.stringify(datas)   
   },

}