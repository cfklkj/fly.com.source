
var chatLeftHtml='<div class="chat_l">\
<div  id="chat_l_t" ><div class="chat_l_t_search">\
<span><img  alt=""/></span>\
<input type="text" value="" name="" required="" maxlength="11" placeholder="search" onchange="chatLeft.search(this)">\
</div>\
</div>\
<div id="chat_l_b"></div>\
</div>'
var layoutChatLeft = layoutChatLeft || {};
var chatLeft = layoutChatLeft.Method = {  
    div_top:'chat_l_t',
    div_bottom:'chat_l_b',
    show:function(){
        eleBody = util.getEleById(chat.div_chat);
        util.addElement(eleBody, chatLeftHtml);  
    },  
    search:function(evt){
        if (evt.value == "")
        {
            chatSearchs.unSearch()
        }else{
            chatSearchs.search(evt.value)            
        } 
    },
    altContent_msg:function(user, msg, times){
        ele = util.getEleById(this.div_bottom).getElementsByTagName("p") 
        for (var i=0; i < ele.length; i++){
            obj = ele[i]
            if (obj.getAttribute("name") == user){
                obj.getElementsByTagName("span")[1].innerText = times
                obj.getElementsByTagName("span")[2].innerText =  msg 
                break
            }
        }
    },
    addContentTag:function(user, datas){  
        if (memHash.find(user)){  
            return
        }
        memHash.add(user,1); 
        times = util.timeHms() 
        p = util.addEle("p")
        p.setAttribute("onclick", "chatLeft.selectContent(this)")
        p.setAttribute("name", user) 
        str = '<img alt="" ></img><span index="1">' + user.substring(0, 11) +'</span><span index="2">' + times  +
            '</span><span index="3">' + datas +'</span>';            
        p.innerHTML = str
        content = document.getElementById(this.div_bottom);
        if (content != null) {
            content.appendChild(p)  
            chatSearchs.addFrend(user, p)
        }else{
            console.debug("---",user, this.div_bottom)
        }
    },
    addContent:function(user, msg){   
        chat.playAudio()
        if (msg.type == imDefine.chat_img ){
            datas = "图片"
        }else if (msg.type == imDefine.chat_file){
            datas = "文件"
        }else{ 
            datas = msg.content
            datas = datas.substring(0, 16)
        }
        if (memHash.find(user)){ 
            times = util.timeHms() 
            this.altContent_msg(user, datas, times)  //会话列表  
            return
        }
        if (!inDiv.isChoiceChat())
        { 
            return
        } 
        this.addContentTag(user, datas)
    },
    selectContent:function(event){
       user = event.getAttribute("name")  
        if(actRecords.get(imDefine.act_selectContent) != user) { 
            chatRight.clearMsg();
            actRecords.add(imDefine.act_selectContent, user);  
            actRecords.add(imDefine.act_selectContentLogLenth, 0); 
            doHttp.ReadMsgLenth(localSocket.loginUser, user);
            chatRight.setTitlename(user)
            util.addClass(event, "selectContent")
            ele = actRecords.get(imDefine.act_selectContentEle)
            if (ele != null){
                util.delClass(ele, "selectContent") 
            }
            actRecords.add(imDefine.act_selectContentEle, event);
            
        }
    },
    clearContent:function(){
        content = document.getElementById(this.div_bottom);
        content.innerHTML = ""; 
    },
    isSelectContent:function(user){
        return actRecords.get(imDefine.act_selectContent) == user
    }
}
 
