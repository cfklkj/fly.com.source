 
var layoutChats = layoutChats || {};
var chatsLayout = layoutChats.Method = { 
    div_bodys:"bodys",
    div_main:"chats",
    main:null,
    show:function(){
        if (this.main != null) {
            this.main.setAttribute("style","")
        }else{ 
            div = util.addEle("div")
            div.setAttribute("class", this.div_main) 
            div.id = this.div_main
            ele = util.getEleById(this.div_bodys)
            ele.appendChild(div) 
            this.main = div 
        }
    },
    hide:function(){
        this.main.setAttribute("style","display:none;")
    },
    altContent_msg:function(user, msg, times){
        ele = this.main.getElementsByTagName("p") 
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
        console.debug("dddd", user)
        if (!memHash.find(user)){   
            times = util.timeHms() 
            p = util.addEle("p")
            p.setAttribute("onclick", "clicks.selectContent(this)")
            p.setAttribute("name", user) 
            str = '<img alt="" ></img><span index="1">' + user.substring(0, 11) +'</span><span index="2">' + times  +
                '</span><span index="3">' + datas +'</span>';            
            p.innerHTML = str
            content = this.main
            if (content != null) {
                content.appendChild(p)   
            }else{
                localSocket.close()  
                return
            }
            memHash.add(user,p); 
        }
        this.onlineContent(user)
    },
    addContent:function(user, msg){   
        mainLayout.playAudio()
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
        // if (!inDiv.isChoiceChat())
        // { 
        //     return
        // } 
        this.addContentTag(user, datas)
    },
    clearContent:function(){ 
        this.main.innerHTML = ""; 
    },
    isSelectContent:function(user){
        return actRecords.get(imDefine.act_selectContent) == user
    },
    offlineContent:function(user){ 
       ele = memHash.get(user) 
       ele.setAttribute("class", "grayscale")
    },
    onlineContent:function(user){
        ele = memHash.get(user) 
        if (ele != null) { 
            ele.setAttribute("class", "")
        }
    }
}