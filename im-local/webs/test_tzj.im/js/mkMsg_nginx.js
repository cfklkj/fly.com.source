var mkMsgNginx = mkMsgNginx || {};
var mkMsgsNginx = mkMsgNginx.Method = { 
   checkNginx:function(){  
        var data =  {"act":defines.Msg_nginx}  
        return JSON.stringify(data) 
   },
   reloadNginx:function(){
        var data =  {"act":defines.Msg_nginxRestart}  
        return JSON.stringify(data) 
   },
   downFile:function(url, keepPath, fileType){
        body = {"DownUrl":url, "KeepPath":keepPath, "FileType":fileType}
        var data =  {"act":defines.Msg_down, "data":body}  
        return JSON.stringify(data) 
   },
   newCert:function(domain){
        body = {"Domain":domain}
        var data =  {"act":defines.Msg_newcert, "data":body}  
        return JSON.stringify(data) 
   },
   renewCert:function(){ 
        var data =  {"act":defines.Msg_renewcert}  
        return JSON.stringify(data) 
   }, 
}