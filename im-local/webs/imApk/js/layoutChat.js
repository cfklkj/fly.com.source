 
var layoutChat = layoutChat || {};
var chatLayout = layoutChat.Method = { 
    div_bodys:"bodys",
    div_main:"chat",
    div_log:"log", 
    div_edit:"edit",  
    main:null,
    log:null,
    edit:null,
    chat_logFirst:false,
    img_div:null,
    addListen:function(){
        this.edit.addEventListener('keydown', function(e){ 
             if(e.keyCode == 13 ) {
                 clicks.sendMsg()
                 return
             } 
        })
    },
    show:function(){
        if (this.main == null) { 
            div = util.addEle("div")
            div.setAttribute("class", this.div_main) 
            div.id = this.div_main
            ele = util.getEleById(this.div_bodys)
            ele.appendChild(div) 
            this.main = div 
            this.addLogDiv()
            this.addEditDiv() 
            this.addListen()
            this.clearEditInfo()
        } 
        this.main.setAttribute("style","")  
    },
    hide:function(){
        this.main.setAttribute("style","display:none;")
    },
    addLogDiv:function(){ 
        div = util.addEle("div")
        div.setAttribute("class", this.div_log) 
        this.main.appendChild(div) 
        this.log = div
    },
    addEditDiv:function(){ 
        div = util.addEle("div")
        div.setAttribute("class", this.div_edit) 
        textarea = util.addEle("textarea") 
        textarea.id = this.div_edit
        div.appendChild(textarea)
        this.main.appendChild(div) 
        div.innerHTML +=  this.addFileUpbutton()  //会变更 textarea 地址
        input = util.addEle("input")
        input.setAttribute("type", "button")
        input.setAttribute("value", "发送")
        input.setAttribute("onclick", "clicks.sendMsg()")  
        div.appendChild(input)
        this.edit = util.getEleById(this.div_edit)
    },
    addFileUpbutton:function(){
        var fileUps='<input onchange="imgDlg.changes(this)" type="file" id="file-button" style="display: none;" value="" />\
        <span index="1" id="fileUpdate-button" onclick="imgDlg.openDlg(\'file-button\')"><div></div><img  alt="" /></span>'
        return fileUps 
    },
    getEditInfo:function(){  
        return this.edit.value 
    },
    clearEditInfo:function(){   
        setTimeout("chatLayout.editFocus()", 300)
    },
    editFocus:function(){
        this.edit.value = ""  
        this.edit.focus() 
    },
    upLog:function(event){ 
        console.debug("ddd")
        if ( this.chat_logFirst || event.scrollTop == 0){  
            this.chat_logFirst = false
            logLength = actRecords.get(imDefine.act_selectContentLogLenth);
            if (logLength < 1) {
                return
            }  
            if(this.chat_isUp)
            {
                return
            }
            this.chat_isUp = true
            user = actRecords.get(imDefine.act_selectContent);
            for ( i = logLength; i > 0; i--)
            {
                if (i + 17 == logLength) {
                    break
                }
                doHttp.mkReadMsg(memHash.get(imDefine.login_user), user, i)
                actRecords.add(imDefine.act_selectContentLogLenth, i - 1); 
            }
            this.chat_isUp = false
        }
    },
    send:function(user, msgData, dataType){
        data = localSocket.tallMsg(user, msgData, dataType) 
        if (user == memHash.get(imDefine.login_user))
        {
            return
        }
        this.addMsg(memHash.get(imDefine.login_user), data)
        data.Sender = memHash.get(imDefine.login_user)
    },
    clearMsg:function(){ 
        this.log.innerHTML = "";  
    },
    addMsg:function(sender, jsData, isLog){ 
        //data.Sender, data.Type, data.Data  
        body = jsData
        htmls = ""
        switch(body.type){
            case imDefine.chat_chat:   //原样输出 xmp 
                if ( body.content == "")
                {
                    return
                } 
                htmls =  "<xmp ondblclick='util.copyData(this)'>" + body.content + "</xmp>"  
                break; 
            case imDefine.chat_img:
                htmls = '<div><img onclick="chatLayout.showImg(this)" alt="" src=' + body.content.path + ' name=' + body.content.name + '></img></div>'
                break; 
            case imDefine.chat_file:
                htmls = '<div><a href=' + body.content.path + ' download=' + body.content.name + '>文件:>' + body.content.name + '</a></div>'
                break; 
        }
        div = util.addEle("div")
        divTriangle = util.addEle("span")
        if (sender == memHash.get(imDefine.login_user))
        { 
            util.addClass(div, "btalk")
            util.addClass(divTriangle, "triangle_right")  
            //header img
            span = util.addEle("span") 
            span.innerHTML = htmls + '<img index="chatImg1" ></img>'
            span.appendChild(divTriangle) 
            div.appendChild(span)
        }else{
            util.addClass(div, "atalk") 
            util.addClass(divTriangle, "triangle_left") 
            //header img
            span = util.addEle("span") 
            span.innerHTML = '<img index="chatImg2" ></img>'
            span.appendChild(divTriangle) 
            span.innerHTML += htmls
            div.appendChild(span) 
        }  
        var Words = this.log
        if (isLog && Words.innerHTML != "") {   //逆
          //  Words.innerHTML = str + Words.innerHTML; 
          Words.insertBefore(div, Words.children[0])
          this.log.scrollTop = this.log.scrollHeight /2
        }else{   //正
           //  Words.innerHTML = Words.innerHTML + str;
           Words.appendChild(div)
           this.log.scrollTop = this.log.scrollHeight 
        }
    }, 
    showImg:function(evt){ 
        div = util.addEle("div")
        util.addClass(div,'showImg')

        span = '<span index="1"><img onclick="chatLayout.hideImg()" ></img></span>' 
        div.innerHTML = span

        span = '<span index="2"><a href="' + evt.src + '" download="' + evt.name + '"><img src="' + evt.src + '"></img></a></span>' 
        div.innerHTML += span 
        eleBody = util.getEleById("bodys");  
        eleBody.appendChild(div)
        this.img_div = div
    },   
    hideImg:function(){
        eleBody = util.getEleById("bodys");
        eleBody.removeChild(this.img_div) 
    },
}


 