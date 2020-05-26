

var click = click || {};
var clicks = click.Method = {  
    copys:function(event){
        obj = event.srcElement ? event.srcElement : event.target 
        if (obj.tagName == "XMP"){
            util.copyData(obj) 
        }
    },
    selectContent:function(event){
        if (typeof(event) == 'string') {
            user = memHash.get(imDefine.login_user)
        }else{ 
            user = event.getAttribute("name")
        }
        titleLayout.setTitle(user) 
        menuLayout.hide() 
        chatsLayout.hide()
        chatLayout.show() 
        titleLayout.showBack()
         if(actRecords.get(imDefine.act_selectContent) != user) { 
            chatLayout.clearMsg();
             actRecords.add(imDefine.act_selectContent, user);  
             actRecords.add(imDefine.act_selectContentLogLenth, 0); 
             doHttp.ReadMsgLenth(memHash.get(imDefine.login_user), user); 
             util.addClass(event, "selectContent")
             ele = actRecords.get(imDefine.act_selectContentEle)
             if (ele != null){
                 util.delClass(ele, "selectContent") 
             }
             actRecords.add(imDefine.act_selectContentEle, event);
             
         }
     },
     sendMsg:function(){ 
         user = actRecords.get(imDefine.act_selectContent)
         if (user == null){
             //user = "7a57a5a743894a0e" 
             return false
         }
         msgData = chatLayout.getEditInfo() 
         if (msgData == "") {            
             return
         } 
         chatLayout.edit.blur()    
         chatLayout.clearEditInfo() 
         chatLayout.send(user, msgData, imDefine.chat_chat)
     },
     back:function(){
        titleLayout.hideBack()
        chatLayout.hide()
        menuLayout.show() 
        chatsLayout.show()
     },
     login:function(){
        username = loginLayout.getUserName()
        if (username == "") {
            return
        }
        password = ""
        //需要修改对应端口
       localSocket.connect("ws://" + util.getIp()+ ":802/wss", username, password) 
      //localSocket.connect("ws://122.51.33.81:802/wss", username, password) 
   
     }
}
document.ondbclick = clicks.copys