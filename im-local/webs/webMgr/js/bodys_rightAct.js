 
var layoutBody_RightAct = layoutBody_RightAct || {};
var bodysRightAct = layoutBody_RightAct.Method = {  
    chat_logFirst:false,   
    startAll:function(){
        sleep = 0
        for (i = 0, len = bodysRight.pList.length; i < len; i++){  
            if (bodysRight.pList[i].innerText == "运行"){
                window.setTimeout("bodysRight.pList["+ i +"].click()", sleep) 
                sleep += 150 
            }
        }
    },
    stopAll:function(){
        sleep = 0
        for (i = 0, len = bodysRight.pList.length; i < len; i++){  
            if (bodysRight.pList[i].innerText == "停止"){
                window.setTimeout("bodysRight.pList["+ i +"].click()", sleep) 
                sleep += 150 
            }
        }
    },
    select:function(event){
        if(bodys.mem.get(defines.act_rightSelect) == event){ 
            return false
        }   
        util.delClass(event, "statuLeftPunSelect")
        util.addClass(event, "select")
        ele = bodys.mem.get(defines.act_rightSelect)
        if (ele != null){
            util.delClass(ele, "select")
            util.addClass(ele, "statuLeftPunSelect") 
        }
        bodys.mem.add(defines.act_rightSelect, event);
        return true
    },  
    getStatulenth:function(evt){
        if(!this.select(evt)){
            return
        }  
        bodysRight.div_statu_right.innerHTML = ""
        localSocket.ReadMsgLenth(evt.innerText)
    },
    upLog:function(event){  
        if ( this.chat_logFirst || event.scrollTop == 0){  
            this.chat_logFirst = false
            logLength = bodys.mem.get(defines.act_selectContentLogLenth);
            if (logLength < 1) {
                return
            }  
            if(this.chat_isUp)
            {
                return
            }
            this.chat_isUp = true
            name = bodys.mem.get(defines.act_rightSelect).innerText;
            for ( i = logLength; i > 0; i--)
            {
                if (i + 25 == logLength) {
                    break
                }
                localSocket.ReadMsg(name, i)
                bodys.mem.add(defines.act_selectContentLogLenth, i - 1); 
            }
            this.chat_isUp = false
        }
    },
}

 
