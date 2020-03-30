var MgrDiv = MgrDiv || {};
var inDiv = MgrDiv.Method = { 
    div_main:'in_main',  
    div_left:'in_left',  
    div_right:'in_right',  
    l_me:"l_me",
    l_chat:"l_chat",
    l_black:"l_black",
    l_set:"l_set",
    div_name:null,
    setLoginUser:function(name){
        div = util.addEle("div")
        ele = util.getEleById(this.l_me)
        ele.appendChild(div)
        ele.setAttribute("onclick", 'inDiv.showName()') 
        div.innerHTML='<div>'+ name +'</div>' 
        this.div_name = div 
        util.addClass(this.div_name, "hideDiv")
    },
    showName:function(){
        if (this.div_name.className == "popName"){
            this.div_name.className = "hideDiv" 
        }else{
            this.div_name.className = "popName"
            window.setTimeout("inDiv.hideName()", 3000)
        }
    },
    hideName:function(){
        this.div_name.className = "hideDiv" 
    },
    showMain:function(){
        eleBody = util.getEleById("bodys");
        util.clearElement(eleBody);  
        util.addElement(eleBody, mainHtml);
        this.paintLeft();
    }, 
    paintLeft:function(){
        eleBody = util.getEleById(this.div_left); 
        util.addElement(eleBody, leftHtml); 
        memHash.add(imDefine.mem_Lchoice, this.l_chat)
        this.paintRight();
    },
    paintRight:function(){
       switch( memHash.get(imDefine.mem_Lchoice)){
           case this.l_chat:
               chat.showChat()
       }
    },
    isChoiceChat:function(){ 
        return memHash.get(imDefine.mem_Lchoice) == this.l_chat
    },
    pubInfo:function(msg){
        switch(msg.Act) {
            case imDefine.Act_Login:
                if (!localSocket.isLoginUser(msg.ConversationId)){ 
                    chatLeft.addContentTag(msg.ConversationId, "")  
                }else{                    
                    this.setLoginUser(msg.ConversationId)
                }
                break
        }
    },
    routeInfo:function(from, msg){  
        chatLeft.addContent(from, msg)   
        if (!chatLeft.isSelectContent(from))
        { 
            return
        } 
        chatRight.addMsg(from, msg)   
    }
}
 
var mainHtml='<div id="in_main" class="in_main">\
<div id="in_left" class="in-left"></div>\
<div id="in_right" class="in-right"></div>\
<div>'

var leftHtml='<div id="l_me" title=""><img  alt="" /></div>'
{/* <div id="l_chat"><img  alt="" src="/image/info.png"/></div>\
<div id="l_black"><img  alt="" src="/image/black.png"/></div>\
<div id="l_set"><img  alt="" src="/image/set.png"/></div>\
' */}