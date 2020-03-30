

var routeMsg = routeMsg || {};
var msgRoute = routeMsg.Method = { 
    routeInfo:function(from, msg){  
        chatsLayout.addContent(from, msg)   
        if (!chatsLayout.isSelectContent(from))
        { 
            return
        } 
        chatLayout.addMsg(from, msg)   
    },
    online:function(msg){ 
        if (msg == username ) { 
            //  outDiv.resLogins(data.online)
            loginLayout.logined()
            titleLayout.setTitle(msg) 
          }else{ 
              chatsLayout.addContentTag(msg, "") 
          }
    },
    offline:function(user){
        if (chatsLayout.isSelectContent(user))
        { 
            return
        } 
        chatsLayout.offlineContent(user)        
    }
}