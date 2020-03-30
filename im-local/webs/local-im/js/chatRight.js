var layoutChatRight = layoutChatRight || {};
var chatRight = layoutChatRight.Method = {  
    div_top:'chat_r_t',
    div_top_name:"chat_r_t_name",
    div_middle:'chat_r_m',
    div_bottom:'chat_r_b',
    chat_isUp:false,
    chat_logFirst:false,
    chat_words:null,
    show:function(){
        eleBody = util.getEleById(chat.div_chat);
        util.addElement(eleBody, chatRightHtml);  
 
        util.addEvent("talksub", "chatRight.sendMsg()");   
        util.addScrollEvt(this.div_middle, "chatRight.upLog(this)"); 
        util.addEvent("fileUpdate-button", "imgDlg.openDlg('file-button')") 
        util.addEvt("file-button", "onchange", "imgDlg.changes(this)") 
        this.chat_words = util.getEleById(this.div_middle)
    }, 
    setTitlename:function(name){
        util.setEleName(this.div_top_name, name)
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
                doHttp.mkReadMsg(localSocket.loginUser, user, i)
                actRecords.add(imDefine.act_selectContentLogLenth, i - 1); 
            }
            this.chat_isUp = false
        }
    },
    send:function(user, msgData, dataType){
        data = localSocket.tallMsg(user, msgData, dataType) 
        if (user == localSocket.loginUser)
        {
            return
        }
        this.addMsg(localSocket.loginUser, data)
        data.Sender = localSocket.loginUser
    },
    sendMsg:function(){ 
        user = actRecords.get(imDefine.act_selectContent)
        if (user == null){
            //user = "7a57a5a743894a0e" 
            return false
        }
        msgData = util.getEleValue("talkwords") 
        if (msgData == "") {            
            return
        }
        util.setEleValue("talkwords", "") 
        chatRight.send(user, msgData, imDefine.chat_chat)
    },
    clearMsg:function(){
        content = document.getElementById(this.div_middle);
        content.innerHTML = ""; 
    },
    addMsg:function(sender, jsData, isLog){ 
        //data.Sender, data.Type, data.Data 
        console.debug("addMsgddd",jsData)
        body = jsData
        htmls = ""
        switch(body.type){
            case imDefine.chat_chat:   //原样输出 xmp 
                if ( body.content == "")
                {
                    return
                } 
                htmls =  "<xmp>" + body.content + "</xmp>"  
                break; 
            case imDefine.chat_img:
                htmls = '<div><img onclick="chat.showImg(this)" alt="" src=' + body.content.path + ' name=' + body.content.name + '></img></div>'
                break; 
            case imDefine.chat_file:
                htmls = '<div><a href=' + body.content.path + ' download=' + body.content.name + '>文件:>' + body.content.name + '</a></div>'
                break; 
        }
        div = util.addEle("div")
        divTriangle = util.addEle("span")
        if (sender == localSocket.loginUser)
        { 
            util.addClass(div, "btalk")
            util.addClass(divTriangle, "triangle_right") 
            // span = util.addEle("span")
            // span.innerHTML = htmls
            // div.appendChild(span)  
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
            // span = util.addEle("span")
            // span.innerHTML = htmls
            // div.appendChild(span) 
        } 
        console.debug(div)
        var Words = document.getElementById(this.div_middle);
        if (isLog) {   //逆
          //  Words.innerHTML = str + Words.innerHTML; 
          Words.insertBefore(div, Words.children[0])
          this.chat_words.scrollTop = this.chat_words.scrollHeight /2
        }else{   //正
           //  Words.innerHTML = Words.innerHTML + str;
           Words.appendChild(div)
             this.chat_words.scrollTop = this.chat_words.scrollHeight 
        }
    },  
    talk:function(){

    }

}
 
var chatRightHtml='<div class="chat_r">\
<div  class="chat_r_t" >\
<p><span id="chat_r_t_name">...</span></p>\
</div>\
<i></i>\
<div  id="chat_r_m"></div>\
<div  id="chat_r_b">\
<input type="file" id="file-button" style="display: none;" value="">\
<span index="1" id="fileUpdate-button"><img  alt=""/></span>\
<textarea  id="talkwords" value=""></textarea>\
<input type="button" value="发送" id="talksub"></input>\
</div>\
</div>'

// var chatHtml='<div class="talk_con">\
// <div class="div-right">\
// <div class="talk_show" id="words">\
//     <div class="atalk"><span id="asay">A说：吃饭了吗？</span></div>\
//     <div class="btalk"><span id="bsay">B说：还没呢，你呢？</span></div>\
// </div>\
// <div class="talk_input">\
//     <textarea class="talk_word" id="talkwords"></textarea>\
//     <input type="file" id="file-button" style="display: none;" name="qiniuPic" accept="image/*" >\
//     <div class="file_scan" style="width: 100px;float: left; margin-top: 20px;" id="fileUpdate-button">\
//         添加浏览\
//     </div>\
//     <input type="button" value="发送" class="talk_sub" id="talksub">\
// </div>\
// </div>\
// </div>'